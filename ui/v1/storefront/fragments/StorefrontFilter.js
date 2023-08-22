import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { OrganizationFilterContext, OrganizationFilterDispatchContext }
  from '../../../../components/context/OrganizationFilterContext'
import { SectorActiveFilters, SectorAutocomplete } from '../../shared/filter/Sector'
import { CountryAutocomplete, CountryActiveFilters } from '../../shared/filter/Country'
import { BuildingBlockActiveFilters, BuildingBlockAutocomplete } from '../../shared/filter/BuildingBlock'

const StorefrontFilter = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const {
    sectors,
    countries,
    buildingBlocks,
    specialties,
    certifications
  } = useContext(OrganizationFilterContext)

  const {
    setSectors,
    setCountries,
    setBuildingBlocks,
    setSpecialties,
    setCertifications
  } = useContext(OrganizationFilterDispatchContext)

  const clearFilter = (e) => {
    e.preventDefault()

    setSectors([])
    setCountries([])
    setBuildingBlocks([])
    setSpecialties([])
    setCertifications([])
  }

  const filteringOrganization = () => {
    return sectors.length +
      countries.length +
      buildingBlocks.length +
      specialties.length +
      certifications.length > 0
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
            <BuildingBlockActiveFilters buildingBlocks={buildingBlocks} setBuildingBlocks={setBuildingBlocks} />
          </div>
        </div>
      }
      <div className='flex flex-col gap-y-2'>
        <div className='text-sm font-semibold text-dial-sapphire'>
          {format('ui.filter.primary.title')}
        </div>
        <hr className='border-b border-dial-slate-200'/>
        <SectorAutocomplete sectors={sectors} setSectors={setSectors} />
        <hr className='border-b border-dial-slate-200'/>
        <CountryAutocomplete countries={countries} setCountries={setCountries} />
        <hr className='border-b border-dial-slate-200'/>
        <BuildingBlockAutocomplete buildingBlocks={buildingBlocks} setBuildingBlocks={setBuildingBlocks} />
        <hr className='border-b border-dial-slate-200'/>
      </div>
    </div>
  )
}

export default StorefrontFilter
