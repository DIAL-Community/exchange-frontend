import { useContext } from 'react'
import { MdClose } from 'react-icons/md'
import { useIntl } from 'react-intl'

import { OrganizationFilterContext, OrganizationFilterDispatchContext } from '../context/OrganizationFilterContext'
import { CountryAutocomplete, CountryFilters } from './element/Country'
import { EndorsingYearFilters, EndorsingYearSelect } from './element/EndorsingYear'
import { SectorAutocomplete, SectorFilters } from './element/Sector'

const OrganizationFilter = (props) => {
  const openFilter = props.openFilter

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

  return (
    <div className='px-2'>
      {
        openFilter &&
          <div className='grid grid-cols-11 gap-4 pb-4 pt-2'>
            <div className='col-span-11 md:col-span-6'>
              <div className='text-white text-xl px-2 pb-3'>
                {format('filter.entity', { entity: format('organization.label')}).toUpperCase()}
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
                {format('filter.organization.aggregatorOnly')}
                <MdClose className='ml-3 inline cursor-pointer' onClick={toggleEndorser} />
              </div>
          }
          <EndorsingYearFilters {...{ years, setYears }} />
          <CountryFilters {...{ countries, setCountries }} />
          <SectorFilters {...{ sectors, setSectors }} />
          {
            filterCount() > 0 &&
              <a className='px-2 py-1  mt-2 text-sm text-white' href='#clear-filter' onClick={clearFilter}>
                {format('filter.general.clearAll')}
              </a>
          }
        </div>
      </div>
    </div>
  )
}

export default OrganizationFilter
