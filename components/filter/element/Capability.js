import dynamic from 'next/dynamic'
import { MdClose } from 'react-icons/md'
import { gql, useApolloClient } from '@apollo/client'
import { useIntl } from 'react-intl'
import { asyncSelectStyles } from '../../../lib/utilities'

// https://github.com/JedWatson/react-select/issues/3590
const AsyncSelect = dynamic(() => import('react-select/async'), { ssr: false })

const CAPABILITY_SEARCH_QUERY = gql`
  query CapabilityOnly($search: String!) {
    capabilityOnly(search: $search) {
      service
      capability
    }
  }
`

const customStyles = (controlSize = '18rem') => {
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

export const CapabilityAutocomplete = (props) => {
  const client = useApolloClient()
  const { services, setServices, containerStyles, controlSize } = props

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const selectCapability = (service) => {
    setServices([...services.filter(c => c.value !== service.value), service])
  }

  const fetchOptions = async (input, callback, query) => {
    if (input && input.trim().length < 2) {
      return []
    }

    const response = await client.query({
      query: query,
      variables: {
        search: input
      }
    })

    if (response.data && response.data.capabilityOnly) {
      return response.data.capabilityOnly
        .map((service) => ({
          label: `${service.service} - ${service.capability}`,
          value: `${service.service} - ${service.capability}`
        }))
        .sort((a, b) => {
          if (a.label < b.label) {
            return -1
          }

          if (b.label > a.label) {
            return 1
          }

          return 0
        })
    }

    return []
  }

  return (
    <div className={`${containerStyles} catalog-filter text-dial-gray-dark flex`}>
      <AsyncSelect
        aria-label={format('filter.byEntity', { entity: format('service.label') })}
        className='rounded text-sm text-dial-gray-dark mt-1 block w-full'
        cacheOptions
        defaultOptions
        loadOptions={(input, callback) => fetchOptions(input, callback, CAPABILITY_SEARCH_QUERY)}
        noOptionsMessage={() => format('filter.searchFor', { entity: format('service.header') })}
        onChange={selectCapability}
        placeholder={format('filter.byEntity', { entity: format('service.label') })}
        styles={customStyles(controlSize)}
        value=''
      />
    </div>
  )
}

export const CapabilityFilters = (props) => {
  const { services, setServices } = props

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const removeCapability = (serviceId) => {
    setServices(services.filter(service => service.value !== serviceId))
  }

  return (
    <>
      {
        services &&
          services.map(service => (
            <div key={`filter-${service.label}`} className='px-2 py-1 my-auto rounded-md bg-dial-yellow text-sm text-dial-gray-dark'>
              {`${format('service.label')}: ${service.label}`}
              <MdClose className='ml-3 inline cursor-pointer' onClick={() => removeCapability(service.value)} />
            </div>
          ))
      }
    </>
  )
}
