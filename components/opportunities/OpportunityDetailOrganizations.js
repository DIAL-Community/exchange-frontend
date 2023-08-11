import React, { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useApolloClient, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { ToastContext } from '../../lib/ToastContext'
import Select from '../shared/Select'
import { fetchSelectOptions } from '../../queries/utils'
import Pill from '../shared/Pill'
import OrganizationCard from '../organizations/OrganizationCard'
import EditableSection from '../shared/EditableSection'
import { UPDATE_OPPORTUNITY_ORGANIZATIONS } from '../../mutations/opportunity'
import { ORGANIZATION_SEARCH_QUERY } from '../../queries/organization'
import { useUser } from '../../lib/hooks'

const OpportunityDetailOrganizations = ({ opportunity, canEdit }) => {

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const { user } = useUser()
  const { locale } = useRouter()
  const { showToast } = useContext(ToastContext)

  const [isDirty, setIsDirty] = useState(false)
  const [organizations, setOrganizations] = useState(opportunity?.organizations)

  const [updateOpportunityOrganizations, { data, loading, reset }] = useMutation(
    UPDATE_OPPORTUNITY_ORGANIZATIONS, {
      onError: () => {
        setIsDirty(false)
        setOrganizations(opportunity.organizations)
        showToast(format('toast.organizations.update.failure'), 'error', 'top-center')
        reset()
      },
      onCompleted: (data) => {
        const { updateOpportunityOrganizations: response } = data
        if (response?.opportunity && response?.errors?.length === 0) {
          setIsDirty(false)
          setOrganizations(data.updateOpportunityOrganizations.opportunity.organizations)
          showToast(format('toast.organizations.update.success'), 'success', 'top-center')
        } else {
          setIsDirty(false)
          setOrganizations(opportunity.organizations)
          showToast(format('toast.organizations.update.failure'), 'error', 'top-center')
          reset()
        }
      }
    }
  )

  const fetchedOrganizationsCallback = (data) => (
    data.organizations?.map((organization) => ({
      label: organization.name,
      value: organization.id,
      slug: organization.slug
    }
    ))
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

      updateOpportunityOrganizations({
        variables: {
          slug: opportunity.slug,
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
    const organizations = data?.updateOpportunityOrganizations?.opportunity?.organizations
    setOrganizations( organizations ?? opportunity.organizations)
    setIsDirty(false)
  }

  const displayModeBody = organizations.length
    ? (
      <div className='card-title mb-3 text-dial-gray-dark'>
        {organizations.map(
          (organization, organizationIdx) =>
            <OrganizationCard key={organizationIdx} organization={organization} listType='list' />
        )}
      </div>
    ) : (
      <div className='text-sm pb-5 text-button-gray'>
        {format('opportunity.no-organization')}
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
          loadOptions={(input) => fetchSelectOptions(client, input, ORGANIZATION_SEARCH_QUERY, fetchedOrganizationsCallback)}
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

export default OpportunityDetailOrganizations
