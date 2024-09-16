import { useCallback, useContext, useState } from 'react'
import { FaAngleDown, FaAngleUp, FaXmark } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { FilterContext, FilterDispatchContext } from '../../context/FilterContext'
import { BuildingBlockActiveFilters, BuildingBlockAutocomplete } from '../../shared/filter/BuildingBlock'
import { CountryActiveFilters, CountryAutocomplete } from '../../shared/filter/Country'
import { OrganizationActiveFilters, OrganizationAutocomplete } from '../../shared/filter/Organization'
import { SectorActiveFilters, SectorAutocomplete } from '../../shared/filter/Sector'
import { TagActiveFilters, TagAutocomplete } from '../../shared/filter/Tag'
import { UseCaseActiveFilters, UseCaseAutocomplete } from '../../shared/filter/UseCase'
import Checkbox from '../../shared/form/Checkbox'

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
    showClosed,
    showGovStackOnly
  } = useContext(FilterContext)

  const {
    setBuildingBlocks,
    setCountries,
    setOrganizations,
    setSectors,
    setUseCases,
    setTags,
    setShowClosed,
    setShowGovStackOnly
  } = useContext(FilterDispatchContext)

  const [expanded, setExpanded] = useState(false)

  const toggleClosedOpportunityFilter = () => {
    setShowClosed(!showClosed)
  }

  const toggleShowGovStackOnly = () => {
    setShowGovStackOnly(!showGovStackOnly)
  }

  const clearFilter = () => {
    setShowClosed(false)
    setShowGovStackOnly(false)

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
      + showClosed ? 1 : 0
        + showGovStackOnly ? 1 : 0 > 0
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
                    {format('ui.opportunity.filter.showClosed')}
                    <button type='button' onClick={toggleClosedOpportunityFilter}>
                      <FaXmark size='1rem' />
                    </button>
                  </div>
                </div>
              </div>
            )}
            {showGovStackOnly && (
              <div className='bg-dial-slate-400 text-white px-2 py-1 rounded'>
                <div className='flex flex-row gap-1'>
                  <div className='flex gap-x-1'>
                    {format('ui.opportunity.filter.showGovStackOnly')}
                    <button type='button' onClick={toggleShowGovStackOnly}>
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
        <hr className='border-b border-dial-slate-200' />
        <UseCaseAutocomplete useCases={useCases} setUseCases={setUseCases} />
        <hr className='border-b border-dial-slate-200' />
        <BuildingBlockAutocomplete buildingBlocks={buildingBlocks} setBuildingBlocks={setBuildingBlocks} />
        <hr className='border-b border-dial-slate-200' />
        <OrganizationAutocomplete organizations={organizations} setOrganizations={setOrganizations} />
        <hr className='border-b border-dial-slate-200' />
        <SectorAutocomplete sectors={sectors} setSectors={setSectors} />
        <hr className='border-b border-dial-slate-200' />
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
                {format('ui.opportunity.filter.showClosed')}
              </span>
            </label>
            <label className='flex py-2'>
              <Checkbox onChange={toggleShowGovStackOnly} value={showGovStackOnly} />
              <span className='mx-2 my-auto text-sm'>
                {format('ui.opportunity.filter.showGovStackOnly')}
              </span>
            </label>
            <hr className='border-b border-dial-slate-200' />
            <TagAutocomplete tags={tags} setTags={setTags} />
            <hr className='border-b border-dial-slate-200' />
            <CountryAutocomplete countries={countries} setCountries={setCountries} />
            <hr className='border-b border-dial-slate-200' />
          </>
        }
      </div>
    </div>
  )
}

export default OpportunityFilter
