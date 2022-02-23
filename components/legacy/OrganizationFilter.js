import { useContext, useEffect } from 'react'
import { MdClose } from 'react-icons/md'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { QueryParamContext } from '../context/QueryParamContext'
import { OrganizationFilterContext, OrganizationFilterDispatchContext } from '../context/OrganizationFilterContext'
import { CountryAutocomplete, CountryFilters } from '../filter/element/Country'
import { EndorsingYearFilters, EndorsingYearSelect } from '../filter/element/EndorsingYear'
import { SectorAutocomplete, SectorFilters } from '../filter/element/Sector'
import { parseQuery } from '../shared/SharableLink'

import dynamic from 'next/dynamic'
const SharableLink = dynamic(() => import('../shared/SharableLink'), { ssr: false })

const OrganizationFilter = (props) => {
  const filterDisplayed = props.filterDisplayed

  const { query } = useRouter()
  const { interactionDetected } = useContext(QueryParamContext)

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

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
    <div className='px-2'>
      {
        filterDisplayed &&
          <div className='grid grid-cols-11 gap-4 pb-4 pt-2'>
            <div className='col-span-11 md:col-span-6'>
              <div className='text-white text-xl px-2 pb-3'>
                {format('filter.entity', { entity: format('organization.label') }).toUpperCase()}
              </div>
              <div className='text-sm text-dial-gray-light flex flex-row'>
                <div className='px-2 pb-2 mr-32'>
                  <label className='inline-flex items-center'>
                    <input
                      type='checkbox' className='h-4 w-4 form-checkbox text-white' name='aggregator'
                      checked={aggregator} onChange={toggleAggregator}
                    />
                    <span className='ml-2'>{format('filter.organization.aggregatorOnly')}</span>
                  </label>
                </div>
                <div className='px-2 pb-2 flex'>
                  <label className='inline-flex items-center'>
                    <input
                      type='checkbox' className='h-4 w-4 form-checkbox text-white' name='endorser'
                      checked={endorser} onChange={toggleEndorser}
                    />
                    <span className='ml-2'>{format('filter.organization.endorserOnly')}</span>
                  </label>
                </div>
              </div>
              <div className='text-sm text-dial-gray-light flex flex-row flex-wrap'>
                <EndorsingYearSelect {...{ years, setYears }} containerStyles='px-2 pb-2' />
                <CountryAutocomplete {...{ countries, setCountries }} containerStyles='px-2 pb-2' />
                <SectorAutocomplete {...{ sectors, setSectors }} containerStyles='px-2 pb-2' />
              </div>
            </div>
          </div>
      }
      <div className={`flex flex-row pb-4 ${filterCount() > 0 ? 'block' : 'hidden'}`} id='link1'>
        <div className='px-2 py-1 mt-2 text-sm text-white whitespace-nowrap'>
          {format('filter.general.applied', { count: filterCount() })}:
        </div>
        <div className='flex flex-row flex-wrap'>
          {
            aggregator &&
              <div className='px-2 py-1 mt-2 mr-2 rounded-md bg-dial-yellow text-sm text-dial-gray-dark'>
                {format('filter.organization.aggregatorOnly')}
                <MdClose className='ml-3 inline cursor-pointer' onClick={toggleAggregator} />
              </div>
          }
          {
            endorser &&
              <div className='px-2 py-1 mt-2 mr-2 rounded-md bg-dial-yellow text-sm text-dial-gray-dark'>
                {format('filter.organization.endorserOnly')}
                <MdClose className='ml-3 inline cursor-pointer' onClick={toggleEndorser} />
              </div>
          }
          <EndorsingYearFilters {...{ years, setYears }} />
          <CountryFilters {...{ countries, setCountries }} />
          <SectorFilters {...{ sectors, setSectors }} />

          <div className='flex px-2 py-1 mt-2 text-sm text-white'>
            <a className='border-b-2 border-transparent hover:border-dial-yellow my-auto' href='#clear-filter' onClick={clearFilter}>
              {format('filter.general.clearAll')}
            </a>
            <div className='border-r border-white mx-2 opacity-50' />
            <SharableLink sharableLink={sharableLink} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrganizationFilter
