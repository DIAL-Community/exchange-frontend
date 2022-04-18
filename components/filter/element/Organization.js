import dynamic from 'next/dynamic'
import { MdClose } from 'react-icons/md'
import { gql, useApolloClient } from '@apollo/client'
import { useIntl } from 'react-intl'
import { asyncSelectStyles } from '../../../lib/utilities'

// https://github.com/JedWatson/react-select/issues/3590
const AsyncSelect = dynamic(() => import('react-select/async'), { ssr: false })

const ORGANIZATION_SEARCH_QUERY = gql`
  query Organizations($search: String!, $aggregatorOnly: Boolean) {
    organizations(search: $search, aggregatorOnly: $aggregatorOnly) {
      id
      name
      slug
    }
  }
`

const customStyles = (controlSize = '16rem') => {
  return {
    ...asyncSelectStyles,
    control: (provided) => ({
      ...provided,
      width: controlSize,
      boxShadow: 'none',
      cursor: 'pointer'
    }),
    option: (provided) => ({
      ...provided,
      cursor: 'pointer'
    }),
    menuPortal: (provided) => ({ ...provided, zIndex: 30 }),
    menu: (provided) => ({ ...provided, zIndex: 30 })
  }
}

export const OrganizationAutocomplete = (props) => {
  const client = useApolloClient()
  const { aggregatorOnly, organizations, setOrganizations, containerStyles, controlSize } = props

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
        value: organization.id,
        slug: organization.slug
      }))
    }

    return []
  }

  return (
    <div className={`${containerStyles} catalog-filter text-dial-gray-dark flex`}>
      <AsyncSelect
        aria-label={format('filter.byEntity', {
          entity: aggregatorOnly ? format('aggregator.label') : format('organization.label')
        })}
        className='rounded text-sm text-dial-gray-dark mt-1 block w-full'
        cacheOptions
        defaultOptions
        loadOptions={(input, callback) => fetchOptions(input, aggregatorOnly, callback, ORGANIZATION_SEARCH_QUERY)}
        noOptionsMessage={() => {
          return format('filter.searchFor', {
            entity: aggregatorOnly ? format('aggregator.header') : format('organization.header')
          })
        }}
        onChange={selectOrganization}
        placeholder={format('filter.byEntity', {
          entity: aggregatorOnly ? format('aggregator.label') : format('organization.label')
        })}
        styles={customStyles(controlSize)}
        value=''
      />
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
            <div key={`filter-${organization.label}`} className='px-2 py-1 my-auto rounded-md bg-dial-yellow text-sm text-dial-gray-dark'>
              {`${aggregatorOnly ? format('aggregator.label') : format('organization.label')}: ${organization.label}`}
              <MdClose className='ml-3 inline cursor-pointer' onClick={() => removeOrganization(organization.value)} />
            </div>
          ))
      }
    </>
  )
}
