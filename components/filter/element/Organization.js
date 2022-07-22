import { useApolloClient } from '@apollo/client'
import classNames from 'classnames'
import { useIntl } from 'react-intl'
import { ORGANIZATION_SEARCH_QUERY } from '../../../queries/organization'
import Pill from '../../shared/Pill'
import Select from '../../shared/Select'

export const OrganizationAutocomplete = ({
  organizations,
  setOrganizations,
  aggregatorOnly,
  containerStyles = null,
  controlSize = null,
  placeholder = null,
  isSearch = false
}) => {
  const client = useApolloClient()

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const controlPlaceholder = placeholder ??
    format('filter.byEntity', {
      entity: format(aggregatorOnly ? 'aggregator.label' : 'organization.label')
    })

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
        async
        aria-label={format('filter.byEntity', {
          entity: aggregatorOnly ? format('aggregator.label') : format('organization.label')
        })}
        cacheOptions
        defaultOptions
        loadOptions={(input, callback) => fetchOptions(input, aggregatorOnly, callback, ORGANIZATION_SEARCH_QUERY)}
        onChange={addOrganization}
        value={null}
        placeholder={controlPlaceholder}
        noOptionsMessage={() => {
          format('filter.searchFor', {
            entity: format(aggregatorOnly ? 'aggregator.header' : 'organization.header')
          })
        }}
        controlSize={controlSize}
        isSearch={isSearch}
      />
    </div>
  )
}

export const OrganizationFilters = (props) => {
  const { aggregatorOnly, organizations, setOrganizations } = props

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const removeOrganization = (organizationSlug) => {
    setOrganizations(organizations.filter(({ slug }) => slug !== organizationSlug))
  }

  return (
    <>
      {organizations?.map((organization, organizationIdx) => (
        <div className='py-1' key={organizationIdx}>
          <Pill
            key={`organization-${organizationIdx}`}
            label={`${aggregatorOnly ? format('aggregator.label') : format('organization.label')}: ${organization.label}`}
            onRemove={() => removeOrganization(organization.slug)}
          />
        </div>
      ))}
    </>
  )
}
