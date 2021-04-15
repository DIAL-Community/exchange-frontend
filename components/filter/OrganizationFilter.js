import { useContext } from 'react'
import { MdClose } from 'react-icons/md'

import { OrganizationFilterContext, OrganizationFilterDispatchContext } from '../context/OrganizationFilterContext'
import { CountryAutocomplete, CountryFilters } from './element/Country'
import { EndorsingYearFilters, EndorsingYearSelect } from './element/EndorsingYear'
import { SectorAutocomplete, SectorFilters } from './element/Sector'

const OrganizationFilter = (props) => {
  const openFilter = props.openFilter

  const { aggregator, endorser, sectors, countries, years } = useContext(OrganizationFilterContext)
  const { setAggregator, setEndorser, setSectors, setCountries, setYears } = useContext(OrganizationFilterDispatchContext)

  const toggleAggregator = () => {
    setAggregator(!aggregator)
  }

  const toggleEndorser = () => {
    setEndorser(!endorser)
  }

  const hasFilter = () => {
    return aggregator || endorser || countries.length > 0 || years.length > 0 || sectors.length > 0
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
                {'Organization Filters'.toUpperCase()}
              </div>
              <div className='text-sm text-dial-gray-light flex flex-row'>
                <div className='px-2 pb-2 mr-32'>
                  <label className='inline-flex items-center'>
                    <input
                      type='checkbox' className='h-4 w-4 form-checkbox text-white' name='aggregator'
                      checked={aggregator} onChange={toggleAggregator}
                    />
                    <span className='ml-2'>Aggregators</span>
                  </label>
                </div>
                <div className='px-2 pb-2 flex'>
                  <label className='inline-flex items-center'>
                    <input
                      type='checkbox' className='h-4 w-4 form-checkbox text-white' name='endorser'
                      checked={endorser} onChange={toggleEndorser}
                    />
                    <span className='ml-2'>Endorser</span>
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
      <div className={`flex flex-row pb-4 ${hasFilter() ? 'block' : 'hidden'}`} id='link1'>
        <div className='px-2 py-1 mt-2 text-sm text-white whitespace-nowrap'>
          Filters Applied:
        </div>
        <div className='flex flex-row flex-wrap'>
          {
            aggregator &&
              <div className='px-2 py-1 mt-2 mr-2 rounded-md bg-dial-yellow text-sm text-dial-gray-dark'>
                Aggregator Organizations
                <MdClose className='ml-3 inline cursor-pointer' onClick={toggleAggregator} />
              </div>
          }
          {
            endorser &&
              <div className='px-2 py-1 mt-2 mr-2 rounded-md bg-dial-yellow text-sm text-dial-gray-dark'>
                Endorser Organizations
                <MdClose className='ml-3 inline cursor-pointer' onClick={toggleEndorser} />
              </div>
          }
          <EndorsingYearFilters {...{ years, setYears }} />
          <CountryFilters {...{ countries, setCountries }} />
          <SectorFilters {...{ sectors, setSectors }} />
          {
            hasFilter() &&
              <a className='px-2 py-1  mt-2 text-sm text-white' href='#clear-filter' onClick={clearFilter}>
                Clear all
              </a>
          }
        </div>
      </div>
    </div>
  )
}

export default OrganizationFilter
