import dynamic from 'next/dynamic'
import { MdClose } from 'react-icons/md'
import { gql, useApolloClient } from '@apollo/client'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

// https://github.com/JedWatson/react-select/issues/3590
const AsyncSelect = dynamic(() => import('react-select/async'), { ssr: false })

const SECTOR_SEARCH_QUERY = gql`
  query Sectors($search: String!, $locale: String) {
    sectors(search: $search, locale: $locale) {
      id
      name
      slug
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

export const SectorAutocomplete = (props) => {
  const client = useApolloClient()
  const router = useRouter()
  const { locale } = router
  const { sectors, setSectors, containerStyles } = props

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const selectSector = (sector) => {
    setSectors([...sectors.filter(s => s.value !== sector.value), sector])
  }

  const fetchOptions = async (input, callback, query) => {
    if (input && input.trim().length < 2) {
      return []
    }

    const response = await client.query({
      query: query,
      variables: {
        search: input,
        locale: locale
      }
    })

    if (response.data && response.data.sectors) {
      return response.data.sectors.map((sector) => ({
        label: sector.name,
        value: sector.id,
        slug: sector.slug
      }))
    }

    return []
  }

  return (
    <div className={`${containerStyles} text-dial-gray-dark flex`}>
      <label className='block mt-4'>
        <span className='text-sm text-dial-gray-light'>{format('sector.header')}</span>
        <AsyncSelect
          className='rounded text-sm text-dial-gray-dark mt-1 block w-full'
          cacheOptions
          defaultOptions
          loadOptions={(input, callback) => fetchOptions(input, callback, SECTOR_SEARCH_QUERY)}
          noOptionsMessage={() => format('filter.searchFor', { entity: format('sector.header') })}
          onChange={selectSector}
          placeholder={format('filter.byEntity', { entity: format('sector.label') })}
          styles={customStyles}
          value=''
        />
      </label>
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
          <div key={`filter-${sector.label}`} className='px-2 py-1 mt-2 mr-2 rounded-md bg-dial-yellow text-sm text-dial-gray-dark'>
            {`${format('sector.label')}: ${sector.label}`}
            <MdClose className='ml-3 inline cursor-pointer' onClick={() => removeSector(sector.value)} />
          </div>
        ))
      }
    </>
  )
}
