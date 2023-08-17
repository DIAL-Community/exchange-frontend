import { useApolloClient, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { UPDATE_OPPORTUNITY_ORGANIZATIONS } from '../../shared/mutation/opportunity'
import { ORGANIZATION_SEARCH_QUERY } from '../../shared/query/organization'
import OrganizationCard from '../../organization/OrganizationCard'
import { useUser } from '../../../../lib/hooks'
import { ToastContext } from '../../../../lib/ToastContext'
import EditableSection from '../../shared/EditableSection'
import Pill from '../../shared/form/Pill'
import { fetchSelectOptions } from '../../utils/search'
import Select from '../../shared/form/Select'
import { DisplayType } from '../../utils/constants'

const OpportunityDetailOrganizations = ({ opportunity, canEdit, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [organizations, setOrganizations] = useState(opportunity.organizations)
  const [isDirty, setIsDirty] = useState(false)

  const { user } = useUser()
  const { locale } = useRouter()

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const [updateOpportunityOrganizations, { loading, reset }] = useMutation(UPDATE_OPPORTUNITY_ORGANIZATIONS, {
    onError() {
      setIsDirty(false)
      setOrganizations(opportunity?.organizations)
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.organization.header') }))
      reset()
    },
    onCompleted: (data) => {
      const { updateOpportunityOrganizations: response } = data
      if (response?.opportunity && response?.errors?.length === 0) {
        setIsDirty(false)
        setOrganizations(response?.opportunity?.organizations)
        showSuccessMessage(format('toast.submit.success', { entity: format('ui.organization.header') }))
      } else {
        setIsDirty(false)
        setOrganizations(opportunity?.organizations)
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

  const addOrganizations = (organization) => {
    setOrganizations([
      ...[
        ...organizations.filter(({ id }) => id !== organization.id),
        { id: organization.id, name: organization.name, slug: organization.slug  }
      ]
    ])
    setIsDirty(true)
  }

  const removeOrganizations = (organization) => {
    setOrganizations([...organizations.filter(({ id }) => id !== organization.id)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    if (user) {
      const { userEmail, userToken } = user

      updateOpportunityOrganizations({
        variables: {
          organizationSlugs: organizations.map(({ slug }) => slug),
          slug: opportunity.slug
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
    setOrganizations(opportunity.organizations)
    setIsDirty(false)
  }

  const displayModeBody = organizations.length
    ? <div className='grid grid-cols-2 gap-x-8 gap-y-4'>
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
        base: format('ui.opportunity.label')
      })}
    </div>

  const sectionHeader =
    <div className='text-xl font-semibold text-dial-meadow' ref={headerRef}>
      {format('ui.organization.header')}
    </div>

  const sectionDisclaimer =
    <div className='text-xs italic text-dial-stratos'>
      {format('ui.organization.disclaimer', { entity: format('ui.opportunity.label') })}
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
          onChange={addOrganizations}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3'>
        {organizations.map((organization, organizationIdx) => (
          <Pill
            key={`organizations-${organizationIdx}`}
            label={organization.name}
            onRemove={() => removeOrganizations(organization)}
          />
        ))}
      </div>
    </div>

  return (
    <EditableSection
      canEdit={canEdit}
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

export default OpportunityDetailOrganizations
