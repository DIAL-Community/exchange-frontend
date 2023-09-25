import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { FaAngleUp, FaAngleDown } from 'react-icons/fa6'
import { FaXmark } from 'react-icons/fa6'
import {
  OpportunityFilterContext,
  OpportunityFilterDispatchContext
} from '../../../../components/context/OpportunityFilterContext'
import Checkbox from '../../shared/form/Checkbox'
import { TagActiveFilters, TagAutocomplete } from '../../shared/filter/Tag'
import { SectorActiveFilters, SectorAutocomplete } from '../../shared/filter/Sector'
import { UseCaseActiveFilters, UseCaseAutocomplete } from '../../shared/filter/UseCase'
import { BuildingBlockActiveFilters, BuildingBlockAutocomplete } from '../../shared/filter/BuildingBlock'
import { OrganizationActiveFilters, OrganizationAutocomplete } from '../../shared/filter/Organization'
import { CountryActiveFilters, CountryAutocomplete } from '../../shared/filter/Country'

const OpportunityFilter = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const {
    buildingBlocks,
    countries,
    organizations,
    sectors,
    useCases,
    tags,
    showClosed
  } = useContext(OpportunityFilterContext)

  const {
    setBuildingBlocks,
    setCountries,
    setOrganizations,
    setSectors,
    setUseCases,
    setTags,
    setShowClosed
  } = useContext(OpportunityFilterDispatchContext)

  const [expanded, setExpanded] = useState(false)

  const toggleClosedOpportunityFilter = () => {
    setShowClosed(!showClosed)
  }

  const clearFilter = (e) => {
    e.preventDefault()
    setShowClosed(false)
    setBuildingBlocks([])
    setCountries([])
    setOrganizations([])
    setSectors([])
    setUseCases([])
    setTags([])
  }

  const filteringOpportunity = () => {
    return buildingBlocks.length
      + countries.length
      + organizations.length
      + sectors.length
      + useCases.length
      + tags.length
      + showClosed ? 1 : 0 > 0
  }

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      {filteringOpportunity() &&
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
            <UseCaseActiveFilters useCases={useCases} setUseCases={setUseCases} />
            <BuildingBlockActiveFilters buildingBlocks={buildingBlocks} setBuildingBlocks={setBuildingBlocks} />
            <OrganizationActiveFilters organizations={organizations} setOrganizations={setOrganizations} />
            <SectorActiveFilters sectors={sectors} setSectors={setSectors} />
            <TagActiveFilters tags={tags} setTags={setTags} />
            <CountryActiveFilters countries={countries} setCountries={setCountries} />
            {showClosed && (
              <div className='bg-dial-slate-400 px-2 py-1 rounded text-white'>
                <div className='flex flex-row gap-1'>
                  <div className='flex gap-x-1'>
                    {format('filter.opportunity.showClosed')}
                    <button type='button' onClick={toggleClosedOpportunityFilter}>
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
        <UseCaseAutocomplete useCases={useCases} setUseCases={setUseCases} />
        <hr className='border-b border-dial-slate-200'/>
        <BuildingBlockAutocomplete buildingBlocks={buildingBlocks} setBuildingBlocks={setBuildingBlocks} />
        <hr className='border-b border-dial-slate-200'/>
        <OrganizationAutocomplete organizations={organizations} setOrganizations={setOrganizations} />
        <hr className='border-b border-dial-slate-200'/>
        <SectorAutocomplete sectors={sectors} setSectors={setSectors} />
        <hr className='border-b border-dial-slate-200'/>
      </div>
      <div className='flex flex-col gap-y-2'>
        <div className='text-sm font-semibold text-dial-sapphire'>
          <button type='button' onClick={() => setExpanded(!expanded)}>
            <div className='flex gap-3 text-dial-sapphire'>
              <div className='my-auto'>
                {format('ui.filter.additional.title')}
              </div>
              <div className='ml-auto py-2 text-xl'>
                {expanded ? <FaAngleUp /> : <FaAngleDown />}
              </div>
            </div>
          </button>
        </div>
        {expanded &&
          <>
            <label className='flex py-2'>
              <Checkbox value={showClosed} onChange={toggleClosedOpportunityFilter} />
              <span className='mx-2 my-auto text-sm'>
                {format('filter.opportunity.showClosed')}
              </span>
            </label>
            <hr className='border-b border-dial-slate-200'/>
            <TagAutocomplete tags={tags} setTags={setTags} />
            <hr className='border-b border-dial-slate-200'/>
            <CountryAutocomplete countries={countries} setCountries={setCountries} />
            <hr className='border-b border-dial-slate-200'/>
          </>
        }
      </div>
    </div>
  )
}

export default OpportunityFilter
