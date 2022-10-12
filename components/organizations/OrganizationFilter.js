import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { BsQuestionCircleFill } from 'react-icons/bs'
import { FilterContext } from '../context/FilterContext'
import { OrganizationFilterContext, OrganizationFilterDispatchContext } from '../context/OrganizationFilterContext'
import { CountryAutocomplete } from '../filter/element/Country'
import { EndorsingYearSelect } from '../filter/element/EndorsingYear'
import { SectorAutocomplete } from '../filter/element/Sector'
import Checkbox from '../shared/Checkbox'

const OrganizationFilter = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

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
        <div className='px-2 mb-4 text-base'>
          <a className='cursor-pointer items-center font-semibold gap-1 hover:underline decoration-2 decoration-dial-yellow' onClick={() => setHintDisplayed(true)}>
            <span className='mr-1'>{format('filter.hint.text.an')} {format('organization.label')}</span>
            <BsQuestionCircleFill className='inline text-xl mb-1 fill-dial-yellow' />
          </a>
        </div>
        <div className='text-dial-gray-dark text-xl px-2 pb-3'>
          {format('filter.entity', { entity: format('organization.label') }).toUpperCase()}
        </div>
        <div className='text-sm text-dial-gray-dark flex flex-col'>
          <div className='px-2 pb-2 mr-32'>
            <label className='inline-flex items-center'>
              <Checkbox onChange={toggleAggregator} value={aggregator} />
              <span className='ml-2'>{format('filter.organization.aggregatorOnly')}</span>
            </label>
          </div>
          <div className='px-2 pb-2 flex'>
            <label className='inline-flex items-center'>
              <Checkbox onChange={toggleEndorser} value={endorser} />
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
