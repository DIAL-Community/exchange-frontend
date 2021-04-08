import dynamic from 'next/dynamic'
import { useState } from 'react'
import { MdClose } from 'react-icons/md'
import { gql, useApolloClient } from '@apollo/client'

// https://github.com/JedWatson/react-select/issues/3590
const AsyncSelect = dynamic(() => import('react-select/async'), { ssr: false })

const ORGANIZATION_SEARCH_QUERY = gql`
  query SearchOrganizations($search: String!) {
    searchOrganizations(search: $search) {
      name
      slug
    }
  }
`

const customStyles = {
  control: (provided) => ({
    ...provided,
    width: '12rem'
  })
}

export const OrganizationAutocomplete = (props) => {
  const client = useApolloClient()
  const [organization, setOrganization] = useState('')
  const { organizations, setOrganizations, containerStyles } = props

  const selectOrganization = (organization) => {
    setOrganization('')
    setOrganizations([...organizations.filter(o => o.value !== organization.value), organization])
  }

  const fetchOptions = async (input, callback, query) => {
    if (input && input.trim().length < 4) {
      return []
    }

    const response = await client.query({
      query: query,
      variables: {
        search: input
      }
    })

    if (response.data && response.data.searchOrganizations) {
      return response.data.searchOrganizations.map((organization) => ({
        label: organization.name,
        value: organization.slug
      }))
    }

    return []
  }

  return (
    <div className={`${containerStyles} text-dial-gray-dark flex`}>
      <label className='block mt-4'>
        <span className='text-sm text-dial-gray-light'>Organizations</span>
        <AsyncSelect
          className='rounded text-sm text-dial-gray-dark mt-1 block w-full'
          cacheOptions
          defaultOptions={false}
          loadOptions={(input, callback) => fetchOptions(input, callback, ORGANIZATION_SEARCH_QUERY)}
          noOptionsMessage={() => 'Search for organizations.'}
          onChange={selectOrganization}
          placeholder='Filter by Organization'
          styles={customStyles}
          value={organization}
        />
      </label>
    </div>
  )
}

export const OrganizationFilters = (props) => {
  const { organizations, setOrganizations } = props
  const removeOrganization = (organizationId) => {
    setOrganizations(organizations.filter(organization => organization.value !== organizationId))
  }

  return (
    <>
      {
        organizations &&
          organizations.map(organization => (
            <div key={`filter-${organization.label}`} className='px-2 py-1 mt-2 mr-2 rounded-md bg-dial-yellow text-sm text-dial-gray-dark'>
              {`Organization: ${organization.label}`}
              <MdClose className='ml-3 inline cursor-pointer' onClick={() => removeOrganization(organization.value)} />
            </div>
          ))
      }
    </>
  )
}
