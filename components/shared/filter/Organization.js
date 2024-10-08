import { useCallback, useState } from 'react'
import { BsDash, BsPlus } from 'react-icons/bs'
import { FaXmark } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { useApolloClient } from '@apollo/client'
import Select from '../form/Select'
import { ORGANIZATION_SEARCH_QUERY } from '../query/organization'

export const OrganizationAutocomplete = ({
  organizations,
  setOrganizations,
  aggregatorOnly = false,
  placeholder = null,
  isSearch = false
}) => {
  const client = useApolloClient()
  const [showFilter, setShowFilter] = useState(false)

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const entityKey = aggregatorOnly ? 'ui.aggregator.label' : 'ui.organization.label'
  const controlPlaceholder = placeholder ?? format('filter.byEntity', { entity: format(entityKey) })

  const fetchOptions = async (input, aggregatorOnly, callback, query) => {
    if (input && input.trim().length < 2) {
      return []
    }

    const response = await client.query({
      query,
      variables: {
        search: input,
        aggregatorOnly
      }
    })

    if (response.data && response.data.organizations) {
      return response.data.organizations.map((organization) => ({
        name: organization.name,
        slug: organization.slug,
        label: organization.name,
        value: organization.id
      }))
    }

    return []
  }

  const addOrganization = (organization) => {
    setOrganizations([...organizations.filter(({ label }) => label !== organization.label), organization])
  }

  const toggleFilter = (event) => {
    event.preventDefault()
    setShowFilter(!showFilter)
  }

  return (
    <div className='flex flex-col gap-y-3'>
      <a href='#' className='flex' onClick={toggleFilter}>
        <div className='text-dial-stratos text-sm py-2'>
          {format(entityKey)}
        </div>
        {showFilter
          ? <BsDash className='ml-auto text-dial-stratos my-auto' />
          : <BsPlus className='ml-auto text-dial-stratos my-auto' />
        }
      </a>
      {showFilter &&
        <Select
          async
          isBorderless
          aria-label={format('filter.byEntity', { entity: format(entityKey) })}
          className='rounded text-sm text-dial-gray-dark my-auto'
          cacheOptions
          defaultOptions
          loadOptions={(input, callback) => fetchOptions(input, aggregatorOnly, callback, ORGANIZATION_SEARCH_QUERY)}
          onChange={addOrganization}
          value={null}
          placeholder={controlPlaceholder}
          noOptionsMessage={() => {format('filter.searchFor', { entity: format(entityKey) }) }}
          isSearch={isSearch}
        />
      }
    </div>
  )
}

export const OrganizationActiveFilters = ({ organizations, setOrganizations }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const removeOrganization = (organizationSlug) => {
    setOrganizations(organizations.filter(({ slug }) => slug !== organizationSlug))
  }

  return (
    <>
      {organizations?.map((organization, organizationIndex) => (
        <div key={organizationIndex} className='bg-dial-slate-400 px-2 py-1 rounded'>
          <div className='flex flex-row gap-1'>
            <div className='text-white'>
              {organization.label}
              <div className='mx-2 inline opacity-40'>
                ({format('ui.organization.label')})
              </div>
            </div>
            <button onClick={() => removeOrganization(organization.slug)}>
              <FaXmark size='1rem' className='text-white' />
            </button>
          </div>
        </div>
      ))}
    </>
  )
}
