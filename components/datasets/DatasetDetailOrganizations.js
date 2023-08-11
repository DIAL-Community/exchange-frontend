import { useIntl } from 'react-intl'
import { useState, useEffect, useCallback, useContext } from 'react'
import { useRouter } from 'next/router'
import { useApolloClient, useMutation } from '@apollo/client'
import Pill from '../shared/Pill'
import Select from '../shared/Select'
import EditableSection from '../shared/EditableSection'
import { ToastContext } from '../../lib/ToastContext'
import { UPDATE_DATASET_ORGANIZATIONS } from '../../mutations/dataset'
import { fetchSelectOptions } from '../../queries/utils'
import OrganizationCard from '../organizations/OrganizationCard'
import { ORGANIZATION_SEARCH_QUERY } from '../../queries/organization'
import { useUser } from '../../lib/hooks'

const DatasetDetailOrganizations = ({ dataset, canEdit }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [organizations, setOrganizations] = useState(dataset.organizations)
  const [isDirty, setIsDirty] = useState(false)

  const [updateDatasetOrganizations, { data, loading }] = useMutation(UPDATE_DATASET_ORGANIZATIONS)

  const { user } = useUser()
  const { locale } = useRouter()
  const { showToast } = useContext(ToastContext)

  useEffect(() => {
    if (data?.updateDatasetOrganizations?.errors.length === 0 && data?.updateDatasetOrganizations?.dataset) {
      setOrganizations(data.updateDatasetOrganizations.dataset.organizations)
      showToast(format('dataset.organizations.updated'), 'success', 'top-center')
      setIsDirty(false)
    }
  }, [data, showToast, format])

  const fetchedOrganizationsCallback = (data) => (
    data.organizations.map((organization) => ({
      label: organization.name,
      value: organization.id,
      slug: organization.slug
    }))
  )

  const addOrganization = (organization) => {
    setOrganizations([
      ...organizations.filter(({ slug }) => slug !== organization.slug),
      { name: organization.label, slug: organization.slug }
    ])
    setIsDirty(true)
  }

  const removeOrganization = (organization) => {
    setOrganizations([...organizations.filter(({ slug }) => slug !== organization.slug)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    if (user) {
      const { userEmail, userToken } = user

      updateDatasetOrganizations({
        variables: {
          slug: dataset.slug,
          organizationSlugs: organizations.map(({ slug }) => slug)
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
    setOrganizations(data?.updateDatasetOrganizations?.dataset?.organizations ?? dataset.organizations)
    setIsDirty(false)
  }

  const displayModeBody = organizations.length > 0
    ? (
      <div className='flex flex-col gap-2'>
        {organizations.map(
          (organization, organizationIdx) =>
            <OrganizationCard key={organizationIdx} organization={organization} listType='list' />
        )}
      </div>
    ) : (
      <div className='text-sm pb-5 text-button-gray'>
        {format('dataset.no-organization')}
      </div>
    )

  const editModeBody =
    <>
      <p className='card-title text-dial-stratos mb-3'>
        {format('app.assign')} {format('ui.organization.header')}
      </p>
      <label className='flex flex-col gap-y-2 mb-2' data-testid='organization-search'>
        {`${format('app.searchAndAssign')} ${format('ui.organization.header')}`}
        <Select
          async
          isSearch
          defaultOptions
          cacheOptions
          placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
          loadOptions={(input) =>
            fetchSelectOptions(
              client,
              input,
              ORGANIZATION_SEARCH_QUERY,
              fetchedOrganizationsCallback, locale
            )
          }
          noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.organization.header') })}
          onChange={addOrganization}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3 mt-5'>
        {organizations.map((organization, organizationIdx) => (
          <Pill
            key={`organization-${organizationIdx}`}
            label={organization.name}
            onRemove={() => removeOrganization(organization)}
          />
        ))}
      </div>
    </>

  return (
    <EditableSection
      canEdit={canEdit}
      sectionHeader={format('ui.organization.header')}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isDirty={isDirty}
      isMutating={loading}
      displayModeBody={displayModeBody}
      editModeBody={editModeBody}
    />
  )
}

export default DatasetDetailOrganizations
