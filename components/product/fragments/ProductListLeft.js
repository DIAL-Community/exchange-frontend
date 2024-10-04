import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { FilterContext, FilterDispatchContext } from '../../context/FilterContext'
import { QueryParamContext } from '../../context/QueryParamContext'
import Bookmark from '../../shared/common/Bookmark'
import Share from '../../shared/common/Share'
import { ObjectType } from '../../utils/constants'
import { parseQuery } from '../../utils/share'
import ProductFilter from './ProductFilter'

const ProductListLeft = () => {
  const { query } = useRouter()
  const { interactionDetected } = useContext(QueryParamContext)

  const {
    buildingBlocks,
    countries,
    isLinkedWithDpi,
    licenseTypes,
    origins,
    sdgs,
    sectors,
    showDpgaOnly,
    showGovStackOnly,
    tags,
    useCases,
    workflows
  } = useContext(FilterContext)

  const {
    setBuildingBlocks,
    setCountries,
    setIsLinkedWithDpi,
    setLicenseTypes,
    setOrigins,
    setSdgs,
    setSectors,
    setShowDpgaOnly,
    setShowGovStackOnly,
    setTags,
    setUseCases,
    setWorkflows
  } = useContext(FilterDispatchContext)

  const sharableLink = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const basePath = '/products'

    const originFilters = origins.map(origin => `origins=${origin.value}--${origin.label}`)
    const countryFilters = countries.map(country => `countries=${country.value}--${country.label}`)
    const sectorFilters = sectors.map(sector => `sectors=${sector.value}--${sector.label}`)
    const sdgFilters = sdgs.map(sdg => `sdgs=${sdg.value}--${sdg.label}`)
    const tagFilters = tags.map(tag => `tags=${tag.value}--${tag.label}`)
    const useCaseFilters = useCases.map(useCase => `useCases=${useCase.value}--${useCase.label}`)
    const workflowFilters = workflows.map(workflow => `workflows=${workflow.value}--${workflow.label}`)
    const buildingBlockFilters = buildingBlocks.map(
      buildingBlock => `buildingBlocks=${buildingBlock.value}--${buildingBlock.label}`
    )
    const licenseTypesFilter = licenseTypes.map(
      licenseType => `licenseTypes=${licenseType.value}--${licenseType.label}`
    )
    const linkedWithDpiFilter = isLinkedWithDpi ? 'isLinkedWithDpi=true' : ''
    const showGovStackOnlyFilter = showGovStackOnly ? 'showGovStackOnly=true' : ''
    const showDpgaOnlyFilter = showDpgaOnly ? 'showDpgaOnly=true' : ''

    const activeFilter = 'shareCatalog=true'
    const filterParameters = [
      activeFilter,
      ...originFilters,
      ...countryFilters,
      ...sectorFilters,
      ...sdgFilters,
      ...tagFilters,
      ...useCaseFilters,
      ...workflowFilters,
      ...buildingBlockFilters,
      ...licenseTypesFilter,
      linkedWithDpiFilter,
      showGovStackOnlyFilter,
      showDpgaOnlyFilter
    ].filter(f => f).join('&')

    return `${baseUrl}${basePath}?${filterParameters}`
  }

  useEffect(() => {
    // Only apply this if the use have not interact with the UI and the url is a sharable link
    if (
      query &&
      Object.getOwnPropertyNames(query).length > 1 &&
      query.shareCatalog && !interactionDetected
    ) {
      setIsLinkedWithDpi(query.isLinkedWithDpi === 'true')
      setShowGovStackOnly(query.showGovStackOnly === 'true')
      setShowDpgaOnly(query.showDpgaOnly === 'true')
      parseQuery(query, 'licenseTypes', licenseTypes, setLicenseTypes)
      parseQuery(query, 'origins', origins, setOrigins)
      parseQuery(query, 'countries', countries, setCountries)
      parseQuery(query, 'sectors', sectors, setSectors)
      parseQuery(query, 'sdgs', sdgs, setSdgs)
      parseQuery(query, 'tags', tags, setTags)
      parseQuery(query, 'useCases', useCases, setUseCases)
      parseQuery(query, 'workflows', workflows, setWorkflows)
      parseQuery(query, 'buildingBlocks', buildingBlocks, setBuildingBlocks)
    }
  })

  return (
    <div className='bg-dial-slate-100 h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <ProductFilter />
        <Bookmark sharableLink={sharableLink} objectType={ObjectType.URL} />
        <hr className='border-b border-dial-slate-200' />
        <Share />
        <hr className='border-b border-dial-slate-200' />
      </div>
    </div>
  )
}

export default ProductListLeft
