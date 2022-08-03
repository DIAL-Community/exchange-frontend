import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import dynamic from 'next/dynamic'
import { QueryParamContext } from '../context/QueryParamContext'
import { OrganizationFilterContext, OrganizationFilterDispatchContext } from '../context/OrganizationFilterContext'
import { parseQuery } from '../shared/SharableLink'
import { EndorsingYearFilters } from '../filter/element/EndorsingYear'
import { CountryFilters } from '../filter/element/Country'
import { SectorFilters } from '../filter/element/Sector'
import Pill from '../shared/Pill'
const SharableLink = dynamic(() => import('../shared/SharableLink'), { ssr: false })

const OrganizationActiveFilter = () => {
  const { query } = useRouter()
  const { interactionDetected } = useContext(QueryParamContext)

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  const { aggregator, endorser, sectors, countries, years } = useContext(OrganizationFilterContext)
  const { setAggregator, setEndorser, setSectors, setCountries, setYears } = useContext(OrganizationFilterDispatchContext)

  const toggleAggregator = () => {
    setAggregator(!aggregator)
  }

  const toggleEndorser = () => {
    setEndorser(!endorser)
  }

  const filterCount = () => {
    let count = 0
    count = endorser ? count + 1 : count
    count = aggregator ? count + 1 : count
    count = count + countries.length + years.length + sectors.length

    return count
  }

  const clearFilter = (e) => {
    e.preventDefault()
    setAggregator(false)
    setEndorser(false)
    setCountries([])
    setSectors([])
    setYears([])
  }

  const sharableLink = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const basePath = 'organizations'

    const aggregatorFilter = aggregator ? 'aggregator=true' : ''
    const endorserFilter = endorser ? 'endorser=true' : ''
    const countryFilters = countries.map(country => `countries=${country.value}--${country.label}`)
    const sectorFilters = sectors.map(sector => `sectors=${sector.value}--${sector.label}`)
    const yearFilters = years.map(year => `years=${year.value}--${year.label}`)

    const activeFilter = 'shareCatalog=true'
    const filterParameters = [
      activeFilter, aggregatorFilter, endorserFilter, ...countryFilters, ...sectorFilters, ...yearFilters
    ].filter(f => f).join('&')

    return `${baseUrl}/${basePath}?${filterParameters}`
  }

  useEffect(() => {
    // Only apply this if the use have not interact with the UI and the url is a sharable link
    if (query && Object.getOwnPropertyNames(query).length > 1 && query.shareCatalog && !interactionDetected) {
      setAggregator(query.aggregator === 'true')
      setEndorser(query.endorser === 'true')
      parseQuery(query, 'countries', countries, setCountries)
      parseQuery(query, 'sectors', sectors, setSectors)
      parseQuery(query, 'years', years, setYears)
    }
  })

  return (
    <div className={`flex flex-row pt-2 ${filterCount() > 0 ? 'block' : 'hidden'}`} id='link1'>
      <div className='flex flex-row flex-wrap px-3 gap-2'>
        {aggregator && (
          <div className='py-1'>
            <Pill
              label={format('filter.organization.aggregatorOnly')}
              onRemove={toggleAggregator}
            />
          </div>
        )}
        {endorser && (
          <div className='py-1'>
            <Pill
              label={format('filter.organization.endorserOnly')}
              onRemove={toggleEndorser}
            />
          </div>
        )}
        <EndorsingYearFilters {...{ years, setYears }} />
        <CountryFilters {...{ countries, setCountries }} />
        <SectorFilters {...{ sectors, setSectors }} />

        <div className='flex px-2 py-1 mt-2 text-sm text-dial-gray-dark'>
          <a
            className='border-b-2 border-transparent hover:border-dial-yellow opacity-50'
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

export default OrganizationActiveFilter
