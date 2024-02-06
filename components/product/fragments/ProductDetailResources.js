import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useApolloClient, useMutation } from '@apollo/client'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import ResourceCard from '../../hub/fragments/ResourceCard'
import EditableSection from '../../shared/EditableSection'
import Pill from '../../shared/form/Pill'
import Select from '../../shared/form/Select'
import { UPDATE_PRODUCT_RESOURCES } from '../../shared/mutation/product'
import { RESOURCE_SEARCH_QUERY } from '../../shared/query/resource'
import { DisplayType } from '../../utils/constants'
import { fetchSelectOptions } from '../../utils/search'

const ProductDetailResources = ({ product, canEdit, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [resources, setResources] = useState(product.resources)
  const [isDirty, setIsDirty] = useState(false)

  const { user } = useUser()
  const { locale } = useRouter()

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const [updateProductResources, { loading, reset }] = useMutation(UPDATE_PRODUCT_RESOURCES, {
    onError() {
      setIsDirty(false)
      setResources(product?.resources)
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.resource.header') }))
      reset()
    },
    onCompleted: (data) => {
      const { updateProductResources: response } = data
      if (response?.product && response?.errors?.length === 0) {
        setIsDirty(false)
        setResources(response?.product?.resources)
        showSuccessMessage(format('toast.submit.success', { entity: format('ui.resource.header') }))
      } else {
        setIsDirty(false)
        setResources(product?.resources)
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.resource.header') }))
        reset()
      }
    }
  })

  const fetchedResourcesCallback = (data) => (
    data.resources?.map((resource) => ({
      id: resource.id,
      name: resource.name,
      slug: resource.slug,
      label: resource.name
    }))
  )

  const addResource = (resource) => {
    setResources([
      ...resources.filter(({ id }) => id !== resource.id), {
        id: resource.id,
        name: resource.name,
        slug: resource.slug,
        label: resource.name
      }
    ])
    setIsDirty(true)
  }

  const removeResource = (resource) => {
    setResources([...resources.filter(({ id }) => id !== resource.id)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    if (user) {
      const { userEmail, userToken } = user

      updateProductResources({
        variables: {
          slug: product.slug,
          resourceSlugs: resources.map(({ slug }) => slug)
        },
        context: {
          headers: {
            'Accept-Language': locale,
            Authorization: `${userEmail} ${userToken}`
          }
        }
      })
    }
  }

  const onCancel = () => {
    setResources(product.resources)
    setIsDirty(false)
  }

  const displayModeBody = resources.length
    ? resources?.map((resource, index) =>
      <ResourceCard key={index} resource={resource} displayType={DisplayType.SMALL_CARD} />
    )
    : <div className='text-sm text-dial-stratos'>
      {format('ui.common.detail.noData', {
        entity: format('ui.resource.label'),
        base: format('ui.product.label')
      })}
    </div>

  const sectionHeader =
    <div className='text-xl font-semibold text-dial-meadow' ref={headerRef}>
      {format('ui.resource.header')}
    </div>

  const editModeBody =
    <div className='px-4 lg:px-6 py-4 flex flex-col gap-y-3 text-sm'>
      <label className='flex flex-col gap-y-2'>
        {`${format('app.searchAndAssign')} ${format('ui.resource.label')}`}
        <Select
          async
          isSearch
          isBorderless
          defaultOptions
          cacheOptions
          placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
          loadOptions={(input) =>
            fetchSelectOptions(client, input, RESOURCE_SEARCH_QUERY, fetchedResourcesCallback)
          }
          noOptionsMessage={() => format('filter.searchFor', { entity: format('resource.label') })}
          onChange={addResource}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3'>
        {resources.map((resource, resourceIdx) => (
          <Pill
            key={`resources-${resourceIdx}`}
            label={resource.name}
            onRemove={() => removeResource(resource)}
          />
        ))}
      </div>
    </div>

  return (
    <EditableSection
      canEdit={canEdit}
      sectionHeader={sectionHeader}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isDirty={isDirty}
      isMutating={loading}
      displayModeBody={displayModeBody}
      editModeBody={editModeBody}
    />
  )
}

export default ProductDetailResources
