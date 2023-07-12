import Image from 'next/image'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { OrganizationFilterContext, OrganizationFilterDispatchContext } from '../context/OrganizationFilterContext'
import { CountryAutocomplete } from '../filter/element/Country'
import { EndorsingYearSelect } from '../filter/element/EndorsingYear'
import { SectorAutocomplete } from '../filter/element/Sector'
import Checkbox from '../shared/Checkbox'
import OrganizationHint from '../filter/hint/OrganizationHint'

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

  const [openingDetail, setOpeningDetail] = useState(false)
  const toggleHintDetail = () => {
    setOpeningDetail(!openingDetail)
  }

  return (
    <div className='pt-6 pb-10 bg-dial-solitude rounded-lg text-dial-stratos'>
      <div className='text-dial-stratos flex flex-col gap-3'>
        <div className='px-6 text-base flex'>
          <a
            className='cursor-pointer font-semibold flex gap-2'
            onClick={() => toggleHintDetail()}
          >
            <div className='w-6 my-auto image-block-hack'>
              <Image
                width={34}
                height={34}
                src='/assets/info.png'
                alt='Informational hint'
              />
            </div>
            <span className='py-1 border-b-2 border-transparent hover:border-dial-sunshine'>
              {format('filter.hint.text.an')} {format('organization.label')}
            </span>
          </a>
        </div>
        <hr className={`${openingDetail ? 'block' : 'hidden'} border-b border-dial-white-beech`} />
        <div className={`px-6 hidden ${openingDetail ? ' slide-down' : 'slide-up'}`}>
          <OrganizationHint />
        </div>
        <hr className='border-b border-dial-white-beech' />
        <div className='text-xl px-6'>
          {format('filter.entity', { entity: format('organization.label') }).toUpperCase()}
        </div>
        <div className='flex flex-col gap-3 px-6'>
          <label className='inline'>
            <Checkbox onChange={toggleAggregator} value={aggregator} />
            <span className='mx-2 my-auto'>
              {format('filter.organization.aggregatorOnly')}
            </span>
          </label>
          <label className='inline'>
            <Checkbox onChange={toggleEndorser} value={endorser} />
            <span className='mx-2 my-auto'>
              {format('filter.organization.endorserOnly')}
            </span>
          </label>
        </div>
        <div className='flex flex-col gap-3 px-6'>
          <EndorsingYearSelect {...{ years, setYears }} />
          <CountryAutocomplete {...{ countries, setCountries }} />
          <SectorAutocomplete {...{ sectors, setSectors }} />
        </div>
      </div>
    </div>
  )
}

export default OrganizationFilter
