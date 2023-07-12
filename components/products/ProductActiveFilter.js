import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import dynamic from 'next/dynamic'
import { QueryParamContext } from '../context/QueryParamContext'
import { ProductFilterContext, ProductFilterDispatchContext } from '../context/ProductFilterContext'
import { SDGFilters } from '../filter/element/SDG'
import { parseQuery } from '../shared/SharableLink'
import { UseCaseFilters } from '../filter/element/UseCase'
import { WorkflowFilters } from '../filter/element/Workflow'
import { BuildingBlockFilters } from '../filter/element/BuildingBlock'
import { TagFilters } from '../filter/element/Tag'
import { OriginFilters } from '../filter/element/Origin'
import { EndorserFilters } from '../filter/element/Endorser'
import { CountryFilters } from '../filter/element/Country'
import { SectorFilters } from '../filter/element/Sector'
import { OrganizationFilters } from '../filter/element/Organization'
import Pill from '../shared/Pill'
import { LicenseTypeFilters } from '../filter/element/LicenseType'

const SharableLink = dynamic(() => import('../shared/SharableLink'), { ssr: false })

const ProductActiveFilter = () => {
  const { query } = useRouter()
  const { interactionDetected } = useContext(QueryParamContext)

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const {
    isEndorsed, productDeployable, sectors, countries, organizations, origins, sdgs, tags,
    useCases, workflows, buildingBlocks, endorsers, licenseTypes, isLinkedWithDpi
  } = useContext(ProductFilterContext)

  const {
    setIsEndorsed, setProductDeployable, setSectors, setCountries, setOrganizations,
    setOrigins, setSDGs, setTags, setUseCases, setWorkflows, setBuildingBlocks, setEndorsers,
    setLicenseTypes, setIsLinkedWithDpi
  } = useContext(ProductFilterDispatchContext)

  const toggleIsEndorsed = () => {
    setIsEndorsed(!isEndorsed)
  }

  const toggleIsLinkedWithDpi = () => {
    setIsLinkedWithDpi(!isLinkedWithDpi)
  }

  const toggleProductDeployable = () => {
    setProductDeployable(!productDeployable)
  }

  const filterCount = () => {
    let count = 0
    count = isEndorsed ? count + 1 : count
    count = isLinkedWithDpi ? count + 1 : count
    count = productDeployable ? count + 1 : count
    count = count + countries.length + organizations.length + tags.length +
      sectors.length + origins.length + sdgs.length + useCases.length +
      workflows.length + buildingBlocks.length + endorsers.length + licenseTypes.length

    return count
  }

  const clearFilter = (e) => {
    e.preventDefault()
    setIsEndorsed(false)
    setProductDeployable(false)
    setOrigins([])
    setCountries([])
    setSectors([])
    setOrganizations([])
    setSDGs([])
    setTags([])
    setUseCases([])
    setWorkflows([])
    setBuildingBlocks([])
    setEndorsers([])
    setLicenseTypes([])
    setIsLinkedWithDpi(false)
    // router.push(router.pathname)
  }

  const sharableLink = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const basePath = 'products'

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

    const activeFilter = 'shareCatalog=true'
    const filterParameters = [
      activeFilter, endorsedFilter, licenseTypesFilter, deployableFilter, ...originFilters,
      ...countryFilters, ...sectorFilters, ...organizationFilters, ...sdgFilters, ...tagFilters,
      ...useCaseFilters, ...workflowFilters, ...buildingBlockFilters, ...endorserFilters, linkedWithDpiFilter
    ].filter(f => f).join('&')

    return `${baseUrl}/${basePath}?${filterParameters}`
  }

  useEffect(() => {
    // Only apply this if the use have not interact with the UI and the url is a sharable link
    if (
      query &&
      Object.getOwnPropertyNames(query).length > 1 &&
      query.shareCatalog && !interactionDetected
    ) {
      setIsEndorsed(query.isEndorsed === 'true')
      setProductDeployable(query.productDeployable === 'true')
      parseQuery(query, 'licenseTypes', licenseTypes, setLicenseTypes)
      parseQuery(query, 'origins', origins, setOrigins)
      parseQuery(query, 'countries', countries, setCountries)
      parseQuery(query, 'sectors', sectors, setSectors)
      parseQuery(query, 'organizations', organizations, setOrganizations)
      parseQuery(query, 'sdgs', sdgs, setSDGs)
      parseQuery(query, 'tags', tags, setTags)
      parseQuery(query, 'useCases', useCases, setUseCases)
      parseQuery(query, 'workflows', workflows, setWorkflows)
      parseQuery(query, 'buildingBlocks', buildingBlocks, setBuildingBlocks)
      parseQuery(query, 'endorsers', endorsers, setEndorsers)
      setIsLinkedWithDpi(query.isLinkedWithDpi === 'true')
    }
  })

  return (
    <div className={`flex flex-row pt-2 ${filterCount() > 0 ? 'block' : 'hidden'}`}>
      <div className='flex flex-row flex-wrap px-1 gap-2'>
        {isEndorsed && (
          <div className='py-1'>
            <Pill
              label={format('filter.product.endorsed')}
              onRemove={toggleIsEndorsed}
            />
          </div>
        )}
        {productDeployable && (
          <div className='py-1'>
            <Pill
              label={format('filter.product.launchable')}
              onRemove={toggleProductDeployable}
            />
          </div>
        )}
        {isLinkedWithDpi && (
          <div className='py-1'>
            <Pill
              label={format('filter.product.linkedWithDpi')}
              onRemove={toggleIsLinkedWithDpi}
            />
          </div>
        )}
        <SDGFilters {...{ sdgs, setSDGs }} />
        <UseCaseFilters {...{ useCases, setUseCases }} />
        <WorkflowFilters {...{ workflows, setWorkflows }} />
        <BuildingBlockFilters {...{ buildingBlocks, setBuildingBlocks }} />
        <TagFilters {...{ tags, setTags }} />
        <LicenseTypeFilters {...{ licenseTypes, setLicenseTypes }} />
        <OriginFilters {...{ origins, setOrigins }} />
        <EndorserFilters {...{ endorsers, setEndorsers }} />
        <CountryFilters {...{ countries, setCountries }} />
        <SectorFilters {...{ sectors, setSectors }} />
        <OrganizationFilters {...{ organizations, setOrganizations }} />

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

export default ProductActiveFilter
