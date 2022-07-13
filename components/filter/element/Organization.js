import { useApolloClient } from '@apollo/client'
import classNames from 'classnames'
import { useIntl } from 'react-intl'
import { ORGANIZATION_SEARCH_QUERY } from '../../../queries/organization'
import Pill from '../../shared/Pill'
import Select from '../../shared/Select'

export const OrganizationAutocomplete = (props) => {
  const client = useApolloClient()
  const { aggregatorOnly, organizations, setOrganizations, containerStyles, controlSize } = props

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const fetchOptions = async (input, aggregatorOnly, callback, query) => {
    if (input && input.trim().length < 2) {
      return []
    }

    const response = await client.query({
      query: query,
      variables: {
        search: input,
        aggregatorOnly: aggregatorOnly
      }
    })

    if (response.data && response.data.organizations) {
      return response.data.organizations.map((organization) => ({
        label: organization.name,
        value: organization.id,
        slug: organization.slug
      }))
    }

    return []
  }

  const addOrganization = (organization) => {
    setOrganizations([...organizations.filter(({ label }) => label !== organization.label),
      { slug: organization.slug, label: organization.label }])
  }

  return (
    <div className={classNames(containerStyles)} data-testid='organization-search'>
      <Select
        aria-label={format('filter.byEntity', {
          entity: aggregatorOnly ? format('aggregator.label') : format('organization.label')
        })}
        async
        defaultOptions
        loadOptions={(input, callback) => fetchOptions(input, aggregatorOnly, callback, ORGANIZATION_SEARCH_QUERY)}
        onChange={addOrganization}
        value={null}
        placeholder={format('filter.byEntity', {
          entity: aggregatorOnly ? format('aggregator.label') : format('organization.label')
        })}
        noOptionsMessage={() => {
          return format('filter.searchFor', {
            entity: aggregatorOnly ? format('aggregator.header') : format('organization.header')
          })
        }}
        cacheOptions
        controlSize={controlSize}
      />
    </div>
  )
}

export const OrganizationFilters = (props) => {
  const { aggregatorOnly, organizations, setOrganizations } = props

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const removeOrganization = (organizationId) => {
    setOrganizations(organizations.filter(organization => organization.label !== organizationId))
  }

  return (
    <>
      {organizations?.map((organization, organizationIdx) => (
        <Pill
          key={`organization-${organizationIdx}`}
          label={aggregatorOnly ? format('aggregator.label') : organization.label}
          onRemove={() => removeOrganization(organization.label)}
        />
      ))}
    </>
  )
}
