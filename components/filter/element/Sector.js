import dynamic from 'next/dynamic'
import { MdClose } from 'react-icons/md'
import { gql, useApolloClient } from '@apollo/client'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { asyncSelectStyles } from '../../../lib/utilities'
import { fetchSelectOptions } from '../../../queries/utils'
import { SECTOR_SEARCH_QUERY } from '../../../queries/sector'

// https://github.com/JedWatson/react-select/issues/3590
const AsyncSelect = dynamic(() => import('react-select/async'), { ssr: false })

const customStyles = (controlSize = '12rem') => {
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

export const SectorAutocomplete = (props) => {
  const client = useApolloClient()
  const router = useRouter()
  const { locale } = router
  const { sectors, setSectors, containerStyles, controlSize } = props

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const selectSector = (sector) => {
    setSectors([...sectors.filter(s => s.value !== sector.value), sector])
  }

  const fetchedSectorsCallback = (data) => (
    data.sectors.map((sector) => ({
      label: sector.name,
      value: sector.id,
      slug: sector.slug
    }))
  )

  return (
    <div className={`${containerStyles} catalog-filter text-dial-gray-dark flex`}>
      <AsyncSelect
        aria-label={format('filter.byEntity', { entity: format('sector.label') })}
        className='rounded text-sm text-dial-gray-dark my-auto'
        cacheOptions
        defaultOptions
        loadOptions={(input) => fetchSelectOptions(client, input, SECTOR_SEARCH_QUERY, fetchedSectorsCallback, locale)}
        noOptionsMessage={() => format('filter.searchFor', { entity: format('sector.header') })}
        onChange={selectSector}
        placeholder={format('filter.byEntity', { entity: format('sector.label') })}
        styles={customStyles(controlSize)}
        value=''
      />
    </div>
  )
}

export const SectorFilters = (props) => {
  const { sectors, setSectors } = props

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const removeSector = (sectorId) => {
    setSectors(sectors.filter(sector => sector.value !== sectorId))
  }

  return (
    <>
      {
        sectors &&
        sectors.map(sector => (
          <div key={`filter-${sector.label}`} className='px-2 py-1 my-auto rounded-md bg-dial-yellow text-sm text-dial-gray-dark'>
            {`${format('sector.label')}: ${sector.label}`}
            <MdClose className='ml-3 inline cursor-pointer' onClick={() => removeSector(sector.value)} />
          </div>
        ))
      }
    </>
  )
}
