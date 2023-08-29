import Image from 'next/image'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { OpportunityFilterContext, OpportunityFilterDispatchContext } from '../context/OpportunityFilterContext'
import { BuildingBlockAutocomplete } from '../filter/element/BuildingBlock'
import { CountryAutocomplete } from '../filter/element/Country'
import { OrganizationAutocomplete } from '../filter/element/Organization'
import { SectorAutocomplete } from '../filter/element/Sector'
import { UseCaseAutocomplete } from '../filter/element/UseCase'
import OpportunityHint from '../filter/hint/OpportunityHint'
import Checkbox from '../shared/Checkbox'

const OpportunityFilter = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const {
    buildingBlocks,
    countries,
    organizations,
    sectors,
    useCases,
    showClosed
  } = useContext(OpportunityFilterContext)

  const {
    setBuildingBlocks,
    setCountries,
    setOrganizations,
    setSectors,
    setUseCases,
    setShowClosed
  } = useContext(OpportunityFilterDispatchContext)

  const toggleShowClosed = () => {
    setShowClosed(!showClosed)
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
              {format('filter.hint.text.an')} {format('ui.opportunity.label')}
            </span>
          </a>
        </div>
        <hr className={`${openingDetail ? 'block' : 'hidden'} border-b border-dial-white-beech`} />
        <div className={`px-6 hidden ${openingDetail ? ' slide-down' : 'slide-up'}`}>
          <OpportunityHint />
        </div>
        <hr className='border-b border-dial-white-beech' />
        <div className='text-xl px-6'>
          {format('filter.entity', { entity: format('ui.opportunity.label') }).toUpperCase()}
        </div>
        <div className='flex flex-col gap-3 px-6'>
          <BuildingBlockAutocomplete {...{ buildingBlocks, setBuildingBlocks }} />
          <CountryAutocomplete {...{ countries, setCountries }} />
          <SectorAutocomplete {...{ sectors, setSectors }} />
          <OrganizationAutocomplete {...{ organizations, setOrganizations }} />
          <UseCaseAutocomplete {...{ useCases, setUseCases }} />
          <label className='inline'>
            <Checkbox onChange={toggleShowClosed} value={showClosed} />
            <span className='mx-2 my-auto'>
              {format('filter.opportunity.showClosed')}
            </span>
          </label>
        </div>
      </div>
    </div>
  )
}

export default OpportunityFilter
