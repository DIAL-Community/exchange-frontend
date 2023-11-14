import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import Bookmark from '../../shared/common/Bookmark'
import Share from '../../shared/common/Share'
import { ObjectType } from '../../utils/constants'
import {
  OpportunityFilterContext,
  OpportunityFilterDispatchContext
} from '../../context/OpportunityFilterContext'
import { parseQuery } from '../../utils/share'
import { QueryParamContext } from '../../context/QueryParamContext'
import OpportunityFilter from './OpportunityFilter'

const OpportunityListLeft = () => {
  const { query } = useRouter()
  const { interactionDetected } = useContext(QueryParamContext)

  const {
    buildingBlocks,
    countries,
    organizations,
    sectors,
    useCases,
    tags,
    showClosed,
    showGovStackOnly
  } = useContext(OpportunityFilterContext)

  const {
    setBuildingBlocks,
    setCountries,
    setOrganizations,
    setSectors,
    setUseCases,
    setTags,
    setShowClosed,
    setShowGovStackOnly
  } = useContext(OpportunityFilterDispatchContext)

  const sharableLink = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const basePath = '/opportunities'

    const countryFilters = countries.map(country => `countries=${country.value}--${country.label}`)
    const buildingBlockFilters = buildingBlocks.map(
      buildingBlock => `buildingBlocks=${buildingBlock.value}--${buildingBlock.label}`
    )
    const organizationFilters = organizations.map(
      organization => `organizations=${organization.value}--${organization.label}`
    )
    const useCaseFilters = useCases.map(useCase => `useCases=${useCase.value}--${useCase.label}`)
    const sectorFilters = sectors.map(sector => `sectors=${sector.value}--${sector.label}`)
    const tagFilters = tags.map(tag => `tags=${tag.value}--${tag.label}`)
    const showClosedFilter = showClosed ? 'showClosed=true' : ''
    const showGovStackOnlyFilter = showGovStackOnly ? 'showGovStackOnly=true' : ''

    const activeFilter = 'shareCatalog=true'
    const filterParameters = [
      activeFilter, ...countryFilters, ...buildingBlockFilters, ...organizationFilters,
      ...useCaseFilters, ...sectorFilters, ...tagFilters, showClosedFilter, showGovStackOnlyFilter
    ].filter(f => f).join('&')

    return `${baseUrl}${basePath}?${filterParameters}`
  }

  useEffect(() => {
    // Only apply this if the use have not interact with the UI and the url is a sharable link
    const filtered = query && Object.getOwnPropertyNames(query).length > 1 && query.shareCatalog
    if (filtered && !interactionDetected) {
      parseQuery(query, 'countries', countries, setCountries)
      parseQuery(query, 'buildingBlocks', buildingBlocks, setBuildingBlocks)
      parseQuery(query, 'organizations', organizations, setOrganizations)
      parseQuery(query, 'useCases', useCases, setUseCases)
      parseQuery(query, 'sectors', sectors, setSectors)
      parseQuery(query, 'tags', tags, setTags)
      setShowClosed(query.showClosed === 'true')
      setShowGovStackOnly(query.showGovStackOnly === 'true')
    }
  })

  return (
    <div className='bg-dial-slate-100 h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <OpportunityFilter />
        <Bookmark sharableLink={sharableLink} objectType={ObjectType.URL} />
        <hr className='border-b border-dial-slate-200'/>
        <Share />
        <hr className='border-b border-dial-slate-200'/>
      </div>
    </div>
  )
}

export default OpportunityListLeft
