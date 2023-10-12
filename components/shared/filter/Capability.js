import { useApolloClient } from '@apollo/client'
import { useIntl } from 'react-intl'
import { BsDash, BsPlus } from 'react-icons/bs'
import { FaXmark } from 'react-icons/fa6'
import { useCallback, useState } from 'react'
import { fetchSelectOptions } from '../../utils/search'
import { CAPABILITY_SEARCH_QUERY } from '../query/capability'
import Select from '../form/Select'
import { compareAlphabetically } from './utilities'

export const CapabilityAutocomplete = ({
  services,
  setServices,
  placeholder = null,
  isSearch = false
}) => {
  const client = useApolloClient()
  const [showFilter, setShowFilter] = useState(false)

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const controlPlaceholder = placeholder ?? format('filter.byEntity', { entity: format('ui.service.label') })

  const selectCapability = (service) => {
    setServices([...services.filter(c => c.value !== service.value), service])
  }

  const fetchedCapabilityCallback = (data) => (
    data?.capabilityOnly
      .map((service) => ({
        label: `${service.service} - ${service.capability}`,
        value: `${service.service} - ${service.capability}`
      }))
      .sort(compareAlphabetically)
  )

  const toggleFilter = (event) => {
    event.preventDefault()
    setShowFilter(!showFilter)
  }

  return (
    <div className='flex flex-col gap-y-3'>
      <a href='#' className='flex' onClick={toggleFilter}>
        <div className='text-dial-stratos text-sm py-2'>
          {format('ui.service.label')}
        </div>
        {showFilter
          ? <BsDash className='ml-auto text-dial-stratos my-auto' />
          : <BsPlus className='ml-auto text-dial-stratos my-auto' />
        }
      </a>
      {showFilter &&
        <Select
          async
          aria-label={format('filter.byEntity', { entity: format('ui.service.label') })}
          className='rounded text-sm text-dial-gray-dark my-auto'
          cacheOptions
          defaultOptions
          loadOptions={(input) => fetchSelectOptions(client, input, CAPABILITY_SEARCH_QUERY, fetchedCapabilityCallback)}
          noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.service.label') })}
          onChange={selectCapability}
          placeholder={controlPlaceholder}
          value=''
          isSearch={isSearch}
        />
      }
    </div>
  )
}

export const CapabilityActiveFilters = (props) => {
  const { services, setServices } = props

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const removeCapability = (serviceSlug) => {
    setServices(services.filter(({ slug }) => slug !== serviceSlug))
  }

  return (
    <>
      {services?.map((service, serviceIndex) => (
        <div key={serviceIndex} className='bg-dial-slate-400 px-2 py-1 rounded'>
          <div className='flex flex-row gap-1'>
            <div className='text-white'>
              {service.label}
              <div className='mx-2 inline opacity-40'>
                ({format('ui.service.label')})
              </div>
            </div>
            <button onClick={() => removeCapability(service.slug)}>
              <FaXmark size='1rem' className='text-white' />
            </button>
          </div>
        </div>
      ))}
    </>
  )
}
