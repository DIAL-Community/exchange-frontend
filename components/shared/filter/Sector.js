import { useCallback, useState } from 'react'
import { BsDash, BsPlus } from 'react-icons/bs'
import { FaXmark } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { useApolloClient } from '@apollo/client'
import { fetchSelectOptions } from '../../utils/search'
import Select from '../form/Select'
import { SECTOR_SEARCH_QUERY } from '../query/sector'

export const SectorAutocomplete = ({ sectors, setSectors, placeholder }) => {
  const client = useApolloClient()

  const [showFilter, setShowFilter] = useState(false)

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const controlPlaceholder = placeholder ?? format('filter.byEntity', { entity: format('ui.sector.label') })

  const selectSector = (sector) => {
    setSectors([...sectors.filter(s => s.value !== sector.value), sector])
  }

  const fetchCallback = (data) => (
    data?.sectors.map((sector) => ({
      name: sector.name,
      slug: sector.slug,
      label: sector.name,
      value: sector.id
    }))
  )

  const toggleFilter = (event) => {
    event.preventDefault()
    setShowFilter(!showFilter)
  }

  return (
    <div className='flex flex-col gap-y-3'>
      <a href='#' className='flex' onClick={toggleFilter}>
        <div className='text-dial-stratos text-sm py-2'>
          {format('ui.sector.label')}
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
          aria-label={format('filter.byEntity', { entity: format('ui.sector.label') })}
          className='rounded text-sm text-dial-gray-dark my-auto'
          cacheOptions
          defaultOptions
          loadOptions={(input) => fetchSelectOptions(client, input, SECTOR_SEARCH_QUERY, fetchCallback)}
          noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.sector.label') })}
          onChange={selectSector}
          placeholder={controlPlaceholder}
          value=''
        />
      }
    </div>
  )
}

export const SectorActiveFilters = ({ sectors, setSectors }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const removeSector = (sectorSlug) => {
    setSectors(sectors => [...sectors.filter(sector => sector.slug !== sectorSlug)])
  }

  return (
    <>
      {sectors?.map((sector, sectorIndex) => (
        <div key={sectorIndex} className='bg-dial-slate-400 px-2 py-1 rounded'>
          <div className='flex flex-row gap-1'>
            <div className='text-white'>
              {sector.label}
              <div className='mx-2 inline opacity-40'>
                ({format('ui.sector.label')})
              </div>
            </div>
            <button onClick={() => removeSector(sector.slug)}>
              <FaXmark size='1rem' className='text-white' />
            </button>
          </div>
        </div>
      ))}
    </>
  )
}
