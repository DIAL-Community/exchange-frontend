import React, { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useApolloClient, useMutation } from '@apollo/client'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { ToastContext } from '../../lib/ToastContext'
import Select from '../shared/Select'
import { fetchSelectOptions } from '../../queries/utils'
import Pill from '../shared/Pill'
import OrganizationCard from '../organizations/OrganizationCard'
import EditableSection from '../shared/EditableSection'
import { ORGANIZATION_SEARCH_QUERY } from '../../queries/organization'
import { UPDATE_PROJECT_ORGANIZATIONS } from '../../mutations/project'
import { useOrganizationOwnerUser } from '../../lib/hooks'

const ProductDetailOrganizations = ({ project, canEdit }) => {

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [session] = useSession()

  const { locale } = useRouter()

  const [organizations, setOrganizations] = useState(project.organizations)

  const { ownedOrganization } = useOrganizationOwnerUser(session)

  const [isDirty, setIsDirty] = useState(false)

  const { showToast } = useContext(ToastContext)

  const [updateProjectOrganizations, { data, loading }] = useMutation(UPDATE_PROJECT_ORGANIZATIONS, {
    onError: () => {
      setOrganizations(project.organizations)
      setIsDirty(false)
      showToast(format('toast.organizations.update.failure'), 'error', 'top-center')
    },
    onCompleted: (data) => {
      setOrganizations(data.updateProjectOrganizations.project.organizations)
      setIsDirty(false)
      showToast(format('toast.organizations.update.success'), 'success', 'top-center')
    }
  })

  const fetchedOrganizationsCallback = (data) => (
    data.organizations?.map((organization) => ({
      label: organization.name,
      id: organization.id,
      slug: organization.slug
    }
    ))
  )

  const addOrganization = (organization) => {
    setOrganizations([...organizations.filter(({ slug }) => slug !== organization.slug), { name: organization.label, slug: organization.slug, id: organization.id }])
    setIsDirty(true)
  }

  const removeOrganization = (organization) => {
    setOrganizations([...organizations.filter(({ slug }) => slug !== organization.slug)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    if (session) {
      const { userEmail, userToken } = session.user

      updateProjectOrganizations({
        variables: {
          slug: project.slug,
          organizationsSlugs: organizations.map(({ slug }) => slug)
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
    setOrganizations(data?.updateProjectOrganizations?.project?.organizations ?? project.organizations)
    setIsDirty(false)
  }

  const displayModeBody = organizations.length
    ? (
      <div className='card-title mb-3 text-dial-gray-dark'>
        {organizations.map((organization, organizationIdx) => <OrganizationCard key={organizationIdx} organization={organization} listType='list' />)}
      </div>
    ) : (
      <div className='text-sm pb-5 text-button-gray'>
        {format('project.no-organization')}
      </div>
    )

  const editModeBody =
    <>
      <p className='card-title text-dial-blue mb-3'>
        {format('app.assign')} {format('organization.header')}
      </p>
      <label className='flex flex-col gap-y-2 mb-2' data-testid='organization-search'>
        {`${format('app.searchAndAssign')} ${format('organization.header')}`}
        <Select
          async
          isSearch
          defaultOptions
          cacheOptions
          placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
          loadOptions={(input) => fetchSelectOptions(client, input, ORGANIZATION_SEARCH_QUERY, fetchedOrganizationsCallback)}
          noOptionsMessage={() => format('filter.searchFor', { entity: format('organization.header') })}
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
            readOnly={ownedOrganization?.id === parseInt(organization.id)}
          />
        ))}
      </div>
    </>

  return (
    <EditableSection
      canEdit={canEdit}
      sectionHeader={format('organization.header')}
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
