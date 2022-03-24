import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { BsQuestionCircleFill } from 'react-icons/bs'

import { FilterContext } from '../context/FilterContext'
import { OrganizationFilterContext, OrganizationFilterDispatchContext } from '../context/OrganizationFilterContext'

import { CountryAutocomplete } from '../filter/element/Country'
import { EndorsingYearSelect } from '../filter/element/EndorsingYear'
import { SectorAutocomplete } from '../filter/element/Sector'

const OrganizationFilter = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const { setHintDisplayed } = useContext(FilterContext)

  const { aggregator, endorser, sectors, countries, years } = useContext(OrganizationFilterContext)
  const { setAggregator, setEndorser, setSectors, setCountries, setYears } = useContext(OrganizationFilterDispatchContext)

  const toggleAggregator = () => {
    setAggregator(!aggregator)
  }

  const toggleEndorser = () => {
    setEndorser(!endorser)
  }

  return (
    <div className='px-4 py-4'>
      <div className='text-dial-gray-dark'>
        <div className='px-2 mb-4 text-xs'>
          <button className='font-semibold flex gap-1' onClick={() => setHintDisplayed(true)}>
            {format('filter.hint.text.an')} {format('organization.label')}
            <BsQuestionCircleFill className='inline text-sm mb-1' />
          </button>
        </div>
        <div className='text-dial-gray-dark text-xl px-2 pb-3'>
          {format('filter.entity', { entity: format('organization.label') }).toUpperCase()}
        </div>
        <div className='text-sm text-dial-gray-dark flex flex-col'>
          <div className='px-2 pb-2 mr-32'>
            <label className='inline-flex items-center'>
              <input
                type='checkbox' className='h-4 w-4 form-checkbox text-dial-gray-dark' name='aggregator'
                checked={aggregator} onChange={toggleAggregator}
              />
              <span className='ml-2'>{format('filter.organization.aggregatorOnly')}</span>
            </label>
          </div>
          <div className='px-2 pb-2 flex'>
            <label className='inline-flex items-center'>
              <input
                type='checkbox' className='h-4 w-4 form-checkbox text-dial-gray-dark' name='endorser'
                checked={endorser} onChange={toggleEndorser}
              />
              <span className='ml-2'>{format('filter.organization.endorserOnly')}</span>
            </label>
          </div>
        </div>
        <div className='text-sm text-dial-gray-light flex flex-row flex-wrap'>
          <EndorsingYearSelect {...{ years, setYears }} containerStyles='px-2 pb-2' controlSize='20rem' />
          <CountryAutocomplete {...{ countries, setCountries }} containerStyles='px-2 pb-2' controlSize='20rem' />
          <SectorAutocomplete {...{ sectors, setSectors }} containerStyles='px-2 pb-2' controlSize='20rem' />
        </div>
      </div>
    </div>
  )
}

export default OrganizationFilter
