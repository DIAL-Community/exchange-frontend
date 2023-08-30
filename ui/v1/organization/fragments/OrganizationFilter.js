import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { FaXmark } from 'react-icons/fa6'
import { OrganizationFilterContext, OrganizationFilterDispatchContext }
  from '../../../../components/context/OrganizationFilterContext'
import Checkbox from '../../shared/form/Checkbox'
import { SectorActiveFilters, SectorAutocomplete } from '../../shared/filter/Sector'
import { CountryAutocomplete, CountryActiveFilters } from '../../shared/filter/Country'
import { EndorsingYearSelect, EndorsingYearActiveFilters } from '../../shared/filter/EndorsingYear'

const OrganizationFilter = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { aggregator, endorser, sectors, countries, years } = useContext(OrganizationFilterContext)
  const { setAggregator, setEndorser, setSectors, setCountries, setYears } = useContext(OrganizationFilterDispatchContext)

  const toggleAggregator = () => {
    setAggregator(!aggregator)
  }

  const toggleEndorser = () => {
    setEndorser(!endorser)
  }

  const clearFilter = (e) => {
    e.preventDefault()
    setEndorser(false)
    setAggregator(false)

    setSectors([])
    setCountries([])
    setYears([])
  }

  const filteringOrganization = () => {
    return endorser ? 1 : 0 +
      aggregator ? 1 : 0 +
      sectors.length +
      countries.length +
      years.length > 0
  }

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      {filteringOrganization() &&
        <div className='flex flex-col gap-y-3'>
          <div className='flex'>
            <div className='text-sm font-semibold text-dial-sapphire'>
              {format('ui.filter.filteredBy')}
            </div>
            <div className='ml-auto text-sm text-dial-stratos'>
              <button type='button' onClick={clearFilter}>
                <span className='text-dial-sapphire'>
                  {format('ui.filter.clearAll')}
                </span>
              </button>
            </div>
          </div>
          <div className='flex flex-row flex-wrap gap-1 text-sm'>
            <SectorActiveFilters sectors={sectors} setSectors={setSectors} />
            <CountryActiveFilters countries={countries} setCountries={setCountries} />
            <EndorsingYearActiveFilters years={years} setYears={setYears} />
            {aggregator && (
              <div className='bg-dial-slate-400 px-2 py-1 rounded text-white'>
                <div className='flex flex-row gap-1'>
                  <div className='flex gap-x-1'>
                    {format('filter.organization.aggregatorOnly')}
                    <button type='button' onClick={toggleAggregator}>
                      <FaXmark size='1rem' />
                    </button>
                  </div>
                </div>
              </div>
            )}
            {endorser && (
              <div className='bg-dial-slate-400 px-2 py-1 rounded text-white'>
                <div className='flex flex-row gap-1'>
                  <div className='flex gap-x-1'>
                    {format('filter.organization.endorserOnly')}
                    <button onClick={toggleEndorser}>
                      <FaXmark size='1rem' />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      }
      <div className='flex flex-col gap-y-2'>
        <div className='text-sm font-semibold text-dial-sapphire'>
          {format('ui.filter.primary.title')}
        </div>
        <hr className='border-b border-dial-slate-200'/>
        <label className='flex py-2'>
          <Checkbox onChange={toggleAggregator} value={aggregator} />
          <span className='mx-2 my-auto text-sm'>
            {format('filter.organization.aggregatorOnly')}
          </span>
        </label>
        <hr className='border-b border-dial-slate-200'/>
        <label className='flex py-2'>
          <Checkbox onChange={toggleEndorser} value={endorser} />
          <span className='mx-2 my-auto text-sm'>
            {format('filter.organization.endorserOnly')}
          </span>
        </label>
        <hr className='border-b border-dial-slate-200'/>
        <SectorAutocomplete sectors={sectors} setSectors={setSectors} />
        <hr className='border-b border-dial-slate-200'/>
        <CountryAutocomplete countries={countries} setCountries={setCountries} />
        <hr className='border-b border-dial-slate-200'/>
        <EndorsingYearSelect years={years} setYears={setYears} />
        <hr className='border-b border-dial-slate-200'/>
      </div>
    </div>
  )
}

export default OrganizationFilter
