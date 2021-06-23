import dynamic from 'next/dynamic'
import { MdClose } from 'react-icons/md'
import { gql, useApolloClient } from '@apollo/client'
import { useIntl } from 'react-intl'

// https://github.com/JedWatson/react-select/issues/3590
const AsyncSelect = dynamic(() => import('react-select/async'), { ssr: false })

const ORGANIZATION_SEARCH_QUERY = gql`
  query Organizations($search: String!, $aggregatorOnly: Boolean) {
    organizations(search: $search, aggregatorOnly: $aggregatorOnly) {
      id
      name
    }
  }
`

const customStyles = {
  control: (provided) => ({
    ...provided,
    width: '12rem',
    cursor: 'pointer'
  }),
  option: (provided) => ({
    ...provided,
    cursor: 'pointer'
  })
}

export const OrganizationAutocomplete = (props) => {
  const client = useApolloClient()
  const { aggregatorOnly, organizations, setOrganizations, containerStyles } = props

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const selectOrganization = (organization) => {
    setOrganizations([...organizations.filter(o => o.value !== organization.value), organization])
  }

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
        value: organization.id
      }))
    }

    return []
  }

  return (
    <div className={`${containerStyles} text-dial-gray-dark flex`}>
      <label className='block mt-4'>
        <span className='text-sm text-dial-gray-light'>
          {aggregatorOnly ? format('aggregator.label') : format('organization.header')}
        </span>
        <AsyncSelect
          className='rounded text-sm text-dial-gray-dark mt-1 block w-full'
          cacheOptions
          defaultOptions
          loadOptions={(input, callback) => fetchOptions(input, aggregatorOnly, callback, ORGANIZATION_SEARCH_QUERY)}
          noOptionsMessage={() => format('filter.searchFor', { entity: aggregatorOnly ? format('aggregator.header') : format('organization.header') })}
          onChange={selectOrganization}
          placeholder={format('filter.byEntity', { entity: aggregatorOnly ? format('aggregator.label') : format('organization.label') })}
          styles={customStyles}
        />
      </label>
    </div>
  )
}

export const OrganizationFilters = (props) => {
  const { aggregatorOnly, organizations, setOrganizations } = props

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const removeOrganization = (organizationId) => {
    setOrganizations(organizations.filter(organization => organization.value !== organizationId))
  }

  return (
    <>
      {
        organizations &&
          organizations.map(organization => (
            <div key={`filter-${organization.label}`} className='px-2 py-1 mt-2 mr-2 rounded-md bg-dial-yellow text-sm text-dial-gray-dark'>
              {`${aggregatorOnly ? format('aggregator.label') : format('organization.label')}: ${organization.label}`}
              <MdClose className='ml-3 inline cursor-pointer' onClick={() => removeOrganization(organization.value)} />
            </div>
          ))
      }
    </>
  )
}
