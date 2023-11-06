import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import Bookmark from '../../shared/common/Bookmark'
import Share from '../../shared/common/Share'
import { ObjectType } from '../../utils/constants'
import {
  ProductFilterContext,
  ProductFilterDispatchContext
} from '../../context/ProductFilterContext'
import { parseQuery } from '../../utils/share'
import { QueryParamContext } from '../../context/QueryParamContext'
import ProductFilter from './ProductFilter'

const ProductListLeft = () => {
  const { query } = useRouter()
  const { interactionDetected } = useContext(QueryParamContext)

  const {
    isEndorsed, productDeployable, sectors, countries, organizations, origins, sdgs, tags,
    useCases, workflows, buildingBlocks, endorsers, licenseTypes, isLinkedWithDpi, showGovStackOnly
  } = useContext(ProductFilterContext)

  const {
    setIsEndorsed, setProductDeployable, setSectors, setCountries, setOrganizations,
    setOrigins, setSdgs, setTags, setUseCases, setWorkflows, setBuildingBlocks, setEndorsers,
    setLicenseTypes, setIsLinkedWithDpi, setShowGovStackOnly
  } = useContext(ProductFilterDispatchContext)

  const sharableLink = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const basePath = '/products'

    const endorsedFilter = isEndorsed ? 'isEndorsed=true' : ''
    const deployableFilter = productDeployable ? 'productDeployable=true' : ''
    const originFilters = origins.map(origin => `origins=${origin.value}--${origin.label}`)
    const countryFilters = countries.map(country => `countries=${country.value}--${country.label}`)
    const sectorFilters = sectors.map(sector => `sectors=${sector.value}--${sector.label}`)
    const organizationFilters = organizations.map(
      organization => `organizations=${organization.value}--${organization.label}`
    )
    const sdgFilters = sdgs.map(sdg => `sdgs=${sdg.value}--${sdg.label}`)
    const tagFilters = tags.map(tag => `tags=${tag.value}--${tag.label}`)
    const useCaseFilters = useCases.map(useCase => `useCases=${useCase.value}--${useCase.label}`)
    const workflowFilters = workflows.map(workflow => `workflows=${workflow.value}--${workflow.label}`)
    const buildingBlockFilters = buildingBlocks.map(
      buildingBlock => `buildingBlocks=${buildingBlock.value}--${buildingBlock.label}`
    )
    const endorserFilters = endorsers.map(endorser => `endorsers=${endorser.value}--${endorser.label}`)
    const licenseTypesFilter = licenseTypes.map(
      licenseType => `licenseTypes=${licenseType.value}--${licenseType.label}`
    )
    const linkedWithDpiFilter = isLinkedWithDpi ? 'isLinkedWithDpi=true' : ''
    const showGovStackOnlyFilter = showGovStackOnly ? 'showGovStackOnly=true' : ''

    const activeFilter = 'shareCatalog=true'
    const filterParameters = [
      activeFilter, endorsedFilter, licenseTypesFilter, deployableFilter, ...originFilters,
      ...countryFilters, ...sectorFilters, ...organizationFilters, ...sdgFilters, ...tagFilters,
      ...useCaseFilters, ...workflowFilters, ...buildingBlockFilters, ...endorserFilters,
      linkedWithDpiFilter, showGovStackOnlyFilter
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
      setIsEndorsed(query.isEndorsed === 'true')
      setIsLinkedWithDpi(query.isLinkedWithDpi === 'true')
      setShowGovStackOnly(query.showGovStackOnly === 'true')
      setProductDeployable(query.productDeployable === 'true')
      parseQuery(query, 'licenseTypes', licenseTypes, setLicenseTypes)
      parseQuery(query, 'origins', origins, setOrigins)
      parseQuery(query, 'countries', countries, setCountries)
      parseQuery(query, 'sectors', sectors, setSectors)
      parseQuery(query, 'organizations', organizations, setOrganizations)
      parseQuery(query, 'sdgs', sdgs, setSdgs)
      parseQuery(query, 'tags', tags, setTags)
      parseQuery(query, 'useCases', useCases, setUseCases)
      parseQuery(query, 'workflows', workflows, setWorkflows)
      parseQuery(query, 'buildingBlocks', buildingBlocks, setBuildingBlocks)
      parseQuery(query, 'endorsers', endorsers, setEndorsers)
    }
  })

  return (
    <div className='bg-dial-slate-100 h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <ProductFilter />
        <Bookmark sharableLink={sharableLink} objectType={ObjectType.URL} />
        <hr className='border-b border-dial-slate-200'/>
        <Share />
        <hr className='border-b border-dial-slate-200'/>
      </div>
    </div>
  )
}

export default ProductListLeft
