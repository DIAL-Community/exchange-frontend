import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { CountryFilters } from '../../filter/element/Country'
import { SectorFilters } from '../../filter/element/Sector'
import { SpecialtyFilters } from '../../filter/element/Specialties'
import { QueryParamContext } from '../../context/QueryParamContext'
import { OrganizationFilterContext, OrganizationFilterDispatchContext } from '../../context/OrganizationFilterContext'
import { parseQuery } from '../../shared/SharableLink'

const SharableLink = dynamic(() => import('../../shared/SharableLink'), { ssr: false })

const StorefrontActiveFilter = () => {
  const { query } = useRouter()
  const { interactionDetected } = useContext(QueryParamContext)

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { sectors, countries, specialties } = useContext(OrganizationFilterContext)
  const { setSectors, setCountries, setSpecialties } = useContext(OrganizationFilterDispatchContext)

  const filterCount = () => {
    return countries.length + sectors.length + specialties.length
  }

  const clearFilter = (e) => {
    e.preventDefault()
    setCountries([])
    setSectors([])
    setSpecialties([])
  }

  const sharableLink = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const basePath = 'storefronts'

    const countryFilters = countries.map(country => `countries=${country.value}--${country.label}`)
    const sectorFilters = sectors.map(sector => `sectors=${sector.value}--${sector.label}`)
    const specialtyFilters = specialties.map(year => `specialties=${year.value}--${year.label}`)

    const activeFilter = 'shareCatalog=true'
    const filterParameters = [
      activeFilter, ...countryFilters, ...sectorFilters, ...specialtyFilters
    ].filter(f => f).join('&')

    return `${baseUrl}/${basePath}?${filterParameters}`
  }

  useEffect(() => {
    // Only apply this if the use have not interact with the UI and the url is a sharable link
    if (query && Object.getOwnPropertyNames(query).length > 1 && query.shareCatalog && !interactionDetected) {
      parseQuery(query, 'countries', countries, setCountries)
      parseQuery(query, 'sectors', sectors, setSectors)
      parseQuery(query, 'specialties', specialties, setSpecialties)
    }
  })

  return (
    <div className={`flex flex-row pt-2 ${filterCount() > 0 ? 'block' : 'hidden'}`}>
      <div className='flex flex-row flex-wrap px-1 gap-2'>
        <CountryFilters {...{ countries, setCountries }} />
        <SectorFilters {...{ sectors, setSectors }} />
        <SpecialtyFilters {...{ specialties, setSpecialties }} />

        <div className='flex px-2 py-1 mt-2 text-sm text-dial-gray-dark'>
          <a
            className='border-b-2 border-transparent hover:border-dial-sunshine opacity-50'
            href='#clear-filter' onClick={clearFilter}
          >
            {format('filter.general.clearAll')}
          </a>
          <div className='border-r border-dial-gray mx-2 opacity-50' />
          <SharableLink sharableLink={sharableLink} />
        </div>
      </div>
    </div>
  )
}

export default StorefrontActiveFilter
