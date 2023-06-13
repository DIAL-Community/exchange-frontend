import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { OrganizationFilterContext, OrganizationFilterDispatchContext }
  from '../../context/OrganizationFilterContext'
import { CountryAutocomplete } from '../../filter/element/Country'
import { SectorAutocomplete } from '../../filter/element/Sector'
import { SpecialtySelect } from '../../filter/element/Specialties'
import { BuildingBlockAutocomplete } from '../../filter/element/BuildingBlock'

const StorefrontFilter = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { specialties, sectors, countries, buildingBlocks } = useContext(OrganizationFilterContext)
  const { setSpecialties, setSectors, setCountries, setBuildingBlocks } = useContext(OrganizationFilterDispatchContext)

  return (
    <div className='pt-6 pb-10 bg-dial-solitude rounded-lg text-dial-stratos'>
      <div className='text-dial-stratos flex flex-col gap-3'>
        <hr className='border-b border-dial-white-beech' />
        <div className='text-xl px-6'>
          {format('filter.entity', { entity: format('storefront.label') }).toUpperCase()}
        </div>
        <div className='flex flex-col gap-3 px-6'>
          <CountryAutocomplete {...{ countries, setCountries }} />
          <SectorAutocomplete {...{ sectors, setSectors }} />
          <BuildingBlockAutocomplete {...{ buildingBlocks, setBuildingBlocks }} />
          <SpecialtySelect {...{ specialties, setSpecialties }} />
        </div>
      </div>
    </div>
  )
}

export default StorefrontFilter
