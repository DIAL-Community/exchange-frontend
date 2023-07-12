import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import dynamic from 'next/dynamic'
import { QueryParamContext } from '../context/QueryParamContext'
import { OpportunityFilterContext, OpportunityFilterDispatchContext } from '../context/OpportunityFilterContext'
import { parseQuery } from '../shared/SharableLink'
import { CountryFilters } from '../filter/element/Country'
import { SectorFilters } from '../filter/element/Sector'
import { BuildingBlockFilters } from '../filter/element/BuildingBlock'
import { OrganizationFilters } from '../filter/element/Organization'
import { UseCaseFilters } from '../filter/element/UseCase'
import Pill from '../shared/Pill'
const SharableLink = dynamic(() => import('../shared/SharableLink'), { ssr: false })

const OpportunityActiveFilter = () => {
  const { query } = useRouter()
  const { interactionDetected } = useContext(QueryParamContext)

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

  const filterCount = () => {
    return buildingBlocks.length
    + countries.length
    + organizations.length
    + sectors.length
    + useCases.length
    + showClosed ? 1 : 0
  }

  const clearFilter = (e) => {
    e.preventDefault()
    setShowClosed(false)
    setBuildingBlocks([])
    setCountries([])
    setOrganizations([])
    setSectors([])
    setUseCases([])
  }

  const toggleShowClosed = () => {
    setShowClosed(!showClosed)
  }

  const sharableLink = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const basePath = 'opportunities'

    const showClosedFilter = showClosed ? 'showClosed=true' : ''

    const buildingBlockFilters = buildingBlocks.map(
      buildingBlock => `buildingBlocks=${buildingBlock.value}--${buildingBlock.label}`
    )
    const countryFilters = countries.map(country => `countries=${country.value}--${country.label}`)
    const organizationFilters = organizations.map(
      organization => `organizations=${organization.value}--${organization.label}`
    )
    const sectorFilters = sectors.map(sector => `sectors=${sector.value}--${sector.label}`)
    const useCaseFilters = useCases.map(useCase => `useCases=${useCase.value}--${useCase.label}`)

    const activeFilter = 'shareCatalog=true'
    const filterParameters = [
      activeFilter,
      showClosedFilter,
      ...buildingBlockFilters,
      ...countryFilters,
      ...organizationFilters,
      ...sectorFilters,
      ...useCaseFilters
    ].filter(f => f).join('&')

    return `${baseUrl}/${basePath}?${filterParameters}`
  }

  useEffect(() => {
    // Only apply this if the use have not interact with the UI and the url is a sharable link
    if (query && Object.getOwnPropertyNames(query).length > 1 && query.shareCatalog && !interactionDetected) {
      setShowClosed(query.showClosed === 'true')
      parseQuery(query, 'buildingBlocks', buildingBlocks, setBuildingBlocks)
      parseQuery(query, 'countries', countries, setCountries)
      parseQuery(query, 'organizations', organizations, setOrganizations)
      parseQuery(query, 'sectors', sectors, setSectors)
      parseQuery(query, 'useCases', useCases, setUseCases)
    }
  })

  return (
    <div className={`flex flex-row pt-2 ${filterCount() > 0 ? 'block' : 'hidden'}`}>
      <div className='flex flex-row flex-wrap px-1 gap-2'>
        <BuildingBlockFilters {...{ buildingBlocks, setBuildingBlocks }} />
        <CountryFilters {...{ countries, setCountries }} />
        <OrganizationFilters {...{ organizations, setOrganizations }} />
        <SectorFilters {...{ sectors, setSectors }} />
        <UseCaseFilters {...{ useCases, setUseCases }} />
        {showClosed && (
          <div className='py-1'>
            <Pill
              label={format('filter.opportunity.showClosed')}
              onRemove={toggleShowClosed}
            />
          </div>
        )}

        <div className='flex px-2 py-1 mt-2 text-sm text-dial-gray-dark'>
          <a
            className='border-b-2 border-transparent hover:border-dial-sunshine opacity-50'
            href='#clear-filter' onClick={clearFilter}
          >
            {format('filter.general.clearAll')}
          </a>
          <div className='border-r border-dial-gray mx-2 opacity-50' />
          <SharableLink sharableLink={sharableLink} />
        </div>
      </div>
    </div>
  )
}

export default OpportunityActiveFilter
