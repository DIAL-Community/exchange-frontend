import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useApolloClient, useMutation } from '@apollo/client'
import { useUser } from '../../../../lib/hooks'
import { ToastContext } from '../../../../lib/ToastContext'
import EditableSection from '../../../shared/EditableSection'
import Pill from '../../../shared/form/Pill'
import Select from '../../../shared/form/Select'
import { UPDATE_PRODUCT_ORGANIZATIONS } from '../../../shared/mutation/product'
import { ORGANIZATION_SEARCH_QUERY } from '../../../shared/query/organization'
import { DisplayType } from '../../../utils/constants'
import { fetchSelectOptions } from '../../../utils/search'
import OrganizationCard from '../../organization/fragments/OrganizationCard'

const ProductDetailOrganizations = ({ product, editingAllowed, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [organizations, setOrganizations] = useState(product.organizations)
  const [isDirty, setIsDirty] = useState(false)

  const { user } = useUser()
  const { locale } = useRouter()

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const [updateProductOrganizations, { loading, reset }] = useMutation(UPDATE_PRODUCT_ORGANIZATIONS, {
    onError() {
      setIsDirty(false)
      setOrganizations(product?.organizations)
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.organization.header') }))
      reset()
    },
    onCompleted: (data) => {
      const { updateProductOrganizations: response } = data
      if (response?.product && response?.errors?.length === 0) {
        setIsDirty(false)
        setOrganizations(response?.product?.organizations)
        showSuccessMessage(format('toast.submit.success', { entity: format('ui.organization.header') }))
      } else {
        setIsDirty(false)
        setOrganizations(product?.organizations)
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.organization.header') }))
        reset()
      }
    }
  })

  const fetchedOrganizationsCallback = (data) => (
    data.organizations?.map((organization) => ({
      id: organization.id,
      name: organization.name,
      slug: organization.slug,
      label: organization.name
    }))
  )

  const addOrganization = (organization) => {
    setOrganizations([
      ...[
        ...organizations.filter(({ id }) => id !== organization.id),
        { id: organization.id, name: organization.name, slug: organization.slug  }
      ]
    ])
    setIsDirty(true)
  }

  const removeOrganization = (organization) => {
    setOrganizations([...organizations.filter(({ id }) => id !== organization.id)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    if (user) {
      updateProductOrganizations({
        variables: {
          organizationSlugs: organizations.map(({ slug }) => slug),
          slug: product.slug
        },
        context: {
          headers: {
            'Accept-Language': locale
          }
        }
      })
    }
  }

  const onCancel = () => {
    setOrganizations(product.organizations)
    setIsDirty(false)
  }

  const displayModeBody = organizations.length
    ? <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3'>
      {organizations?.map((organization, index) =>
        <OrganizationCard
          key={index}
          organization={organization}
          displayType={DisplayType.SMALL_CARD}
        />
      )}
    </div>
    : <div className='text-sm text-dial-stratos'>
      {format( 'ui.common.detail.noData', {
        entity: format('ui.organization.label'),
        base: format('ui.product.label')
      })}
    </div>

  const sectionHeader =
    <div className='text-xl font-semibold text-health-blue' ref={headerRef}>
      {format('ui.organization.header')}
    </div>

  const sectionDisclaimer =
    <div className='text-xs text-justify italic text-health-green mb-2'>
      {format('ui.product.overview.organization')}
    </div>

  const editModeBody =
    <div className='px-4 lg:px-6 py-4 flex flex-col gap-y-3 text-sm'>
      <label className='flex flex-col gap-y-2'>
        {`${format('app.searchAndAssign')} ${format('ui.organization.label')}`}
        <Select
          async
          isSearch
          isBorderless
          defaultOptions
          cacheOptions
          placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
          loadOptions={(input) =>
            fetchSelectOptions(client, input, ORGANIZATION_SEARCH_QUERY, fetchedOrganizationsCallback)
          }
          noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.organization.label') })}
          onChange={addOrganization}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3'>
        {organizations.map((organization, organizationIdx) => (
          <Pill
            key={`organizations-${organizationIdx}`}
            label={organization.name}
            onRemove={() => removeOrganization(organization)}
          />
        ))}
      </div>
    </div>

  return (
    <EditableSection
      editingAllowed={editingAllowed}
      sectionHeader={sectionHeader}
      sectionDisclaimer={sectionDisclaimer}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isDirty={isDirty}
      isMutating={loading}
      displayModeBody={displayModeBody}
      editModeBody={editModeBody}
    />
  )
}

export default ProductDetailOrganizations
