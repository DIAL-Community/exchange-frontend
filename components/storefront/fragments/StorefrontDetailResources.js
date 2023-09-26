import { useApolloClient, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import Select from '../../shared/form/Select'
import EditableSection from '../../shared/EditableSection'
import Pill from '../../shared/form/Pill'
import { fetchSelectOptions } from '../../utils/search'
import { DisplayType } from '../../utils/constants'
import { UPDATE_ORGANIZATION_RESOURCES } from '../../shared/mutation/organization'
import ResourceCard from '../../resource/ResourceCard'
import { RESOURCE_SEARCH_QUERY } from '../../shared/query/resource'

const StorefrontDetailResources = ({ organization, canEdit, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [resources, setResources] = useState(organization.resources)
  const [isDirty, setIsDirty] = useState(false)

  const { user } = useUser()
  const { locale } = useRouter()

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const [updateOrganizationResources, { loading, reset }] = useMutation(UPDATE_ORGANIZATION_RESOURCES, {
    onError() {
      setIsDirty(false)
      setResources(organization?.resources)
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.resource.header') }))
      reset()
    },
    onCompleted: (data) => {
      const { updateOrganizationResources: response } = data
      if (response?.organization && response?.errors?.length === 0) {
        setIsDirty(false)
        setResources(response?.organization?.resources)
        showSuccessMessage(format('toast.submit.success', { entity: format('ui.resource.header') }))
      } else {
        setIsDirty(false)
        setResources(organization?.resources)
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
      ...[
        ...resources.filter(({ id }) => id !== resource.id),
        { id: resource.id, name: resource.name, slug: resource.slug  }
      ]
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

      updateOrganizationResources({
        variables: {
          resourceSlugs: resources.map(({ slug }) => slug),
          slug: organization.slug
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
    setResources(organization.resources)
    setIsDirty(false)
  }

  const displayModeBody = resources.length
    ? <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3'>
      {resources?.map((resource, index) =>
        <div key={`resource-${index}`}>
          <ResourceCard resource={resource} displayType={DisplayType.SMALL_CARD} />
        </div>
      )}
    </div>
    : <div className='text-sm text-dial-stratos'>
      {format( 'ui.common.detail.noData', {
        entity: format('ui.resource.label'),
        base: format('ui.storefront.label')
      })}
    </div>

  const sectionHeader =
    <div className='text-xl font-semibold text-dial-plum' ref={headerRef}>
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
          noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.resource.label') })}
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

export default StorefrontDetailResources
