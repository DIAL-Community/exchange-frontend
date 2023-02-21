import { useApolloClient } from '@apollo/client'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import { useRouter } from 'next/router'
import classNames from 'classnames'
import { fetchSelectOptions } from '../../../queries/utils'
import { SECTOR_SEARCH_QUERY } from '../../../queries/sector'
import Select from '../../shared/Select'
import Pill from '../../shared/Pill'

export const SectorAutocomplete = ({
  sectors,
  setSectors,
  containerStyles = null,
  controlSize = null,
  placeholder = null,
  isSearch = false
}) => {
  const client = useApolloClient()
  const router = useRouter()
  const { locale } = router

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const controlPlaceholder = placeholder ?? format('filter.byEntity', { entity: format('sector.label') })

  const selectSector = (sector) => {
    setSectors([...sectors.filter(({ slug }) => slug !== sector.slug), sector])
  }

  const fetchedSectorsCallback = (data) => (
    data.sectors.map((sector) => ({
      label: sector.name,
      value: sector.id,
      slug: sector.slug
    }))
  )

  return (
    <div className={classNames(containerStyles)} data-testid='sector-search'>
      <Select
        async
        aria-label={format('filter.byEntity', { entity: format('sector.label') })}
        className='rounded text-sm text-dial-gray-dark my-auto'
        cacheOptions
        defaultOptions
        loadOptions={(input) => fetchSelectOptions(client, input, SECTOR_SEARCH_QUERY, fetchedSectorsCallback, locale)}
        noOptionsMessage={() => format('filter.searchFor', { entity: format('sector.header') })}
        onChange={selectSector}
        placeholder={controlPlaceholder}
        value=''
        controlSize={controlSize}
        isSearch={isSearch}
      />
    </div>
  )
}

export const SectorFilters = (props) => {
  const { sectors, setSectors } = props

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const removeSector = (sectorSlug) => {
    setSectors(sectors.filter(({ slug }) => slug !== sectorSlug))
  }

  return (
    <>
      {sectors?.map((sector, sectorIdx) => (
        <div className='py-1' key={sectorIdx}>
          <Pill
            key={`filter-${sectorIdx}`}
            label={`${format('sector.label')}: ${sector.label}`}
            onRemove={() => removeSector(sector.slug)}
          />
        </div>
      ))}
    </>
  )
}
