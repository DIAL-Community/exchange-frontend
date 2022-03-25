import { useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { MdClose } from 'react-icons/md'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { QueryParamContext } from '../context/QueryParamContext'
import { ProductFilterContext, ProductFilterDispatchContext } from '../context/ProductFilterContext'
import { BuildingBlockAutocomplete, BuildingBlockFilters } from '../filter/element/BuildingBlock'
import { CountryAutocomplete, CountryFilters } from '../filter/element/Country'
import { OrganizationAutocomplete, OrganizationFilters } from '../filter/element/Organization'
import { OriginAutocomplete, OriginFilters } from '../filter/element/Origin'
import { ProductTypeFilters, ProductTypeSelect } from '../filter/element/ProductType'
import { SDGAutocomplete, SDGFilters } from '../filter/element/SDG'
import { TagAutocomplete, TagFilters } from '../filter/element/Tag'
import { SectorAutocomplete, SectorFilters } from '../filter/element/Sector'
import { UseCaseAutocomplete, UseCaseFilters } from '../filter/element/UseCase'
import { WorkflowAutocomplete, WorkflowFilters } from '../filter/element/Workflow'
import { EndorserAutocomplete, EndorserFilters } from '../filter/element/Endorser'
import { parseQuery } from '../shared/SharableLink'
const SharableLink = dynamic(() => import('../shared/SharableLink'), { ssr: false })

const ProductFilter = (props) => {
  const filterDisplayed = props.filterDisplayed

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const { query } = useRouter()
  const { interactionDetected } = useContext(QueryParamContext)

  const {
    withMaturity, productDeployable, forCovid, sectors, countries, organizations, origins, sdgs, tags,
    useCases, workflows, buildingBlocks, productTypes, endorsers
  } = useContext(ProductFilterContext)

  const {
    setWithMaturity, setProductDeployable, setForCovid, setSectors, setCountries, setOrganizations,
    setOrigins, setSDGs, setTags, setUseCases, setWorkflows, setBuildingBlocks, setProductTypes, setEndorsers
  } = useContext(ProductFilterDispatchContext)

  const toggleWithMaturity = () => {
    setWithMaturity(!withMaturity)
  }

  const toggleProductDeployable = () => {
    setProductDeployable(!productDeployable)
  }

  const toggleForCovid = () => {
    !forCovid
      ? setTags([...tags.filter(s => s.value !== 'COVID-19'), { label: 'COVID-19', value: 'COVID-19', slug: 'COVID-19' }])
      : setTags(tags.filter(tag => tag.value !== 'COVID-19'))

    setForCovid(!forCovid)
  }

  const filterCount = () => {
    let count = 0
    count = withMaturity ? count + 1 : count
    count = productDeployable ? count + 1 : count
    count = count + countries.length + organizations.length + tags.length +
      sectors.length + origins.length + sdgs.length + useCases.length +
      workflows.length + buildingBlocks.length + productTypes.length + endorsers.length

    return count
  }

  const clearFilter = (e) => {
    e.preventDefault()
    setWithMaturity(false)
    setProductDeployable(false)
    setForCovid(false)
    setOrigins([])
    setCountries([])
    setSectors([])
    setOrganizations([])
    setProductTypes([])
    setSDGs([])
    setTags([])
    setUseCases([])
    setWorkflows([])
    setBuildingBlocks([])
    setEndorsers([])

    // router.push(router.pathname)
  }

  const sharableLink = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const basePath = 'products'

    const maturityFilter = withMaturity ? 'withMaturity=true' : ''
    const deployableFilter = productDeployable ? 'productDeployable=true' : ''
    const originFilters = origins.map(origin => `origins=${origin.value}--${origin.label}`)
    const countryFilters = countries.map(country => `countries=${country.value}--${country.label}`)
    const sectorFilters = sectors.map(sector => `sectors=${sector.value}--${sector.label}`)
    const organizationFilters = organizations.map(organization => `organizations=${organization.value}--${organization.label}`)
    const productTypeFilters = productTypes.map(productType => `productTypes=${productType.value}--${productType.label}`)
    const sdgFilters = sdgs.map(sdg => `sdgs=${sdg.value}--${sdg.label}`)
    const tagFilters = tags.map(tag => `tags=${tag.value}--${tag.label}`)
    const useCaseFilters = useCases.map(useCase => `useCases=${useCase.value}--${useCase.label}`)
    const workflowFilters = workflows.map(workflow => `workflows=${workflow.value}--${workflow.label}`)
    const buildingBlockFilters = buildingBlocks.map(buildingBlock => `buildingBlocks=${buildingBlock.value}--${buildingBlock.label}`)
    const endorserFilters = endorsers.map(endorser => `endorsers=${endorser.value}--${endorser.label}`)

    const activeFilter = 'shareCatalog=true'
    const filterParameters = [
      activeFilter, maturityFilter, deployableFilter, ...originFilters, ...countryFilters, ...productTypeFilters,
      ...sectorFilters, ...organizationFilters, ...sdgFilters, ...tagFilters, ...useCaseFilters,
      ...workflowFilters, ...buildingBlockFilters, ...endorserFilters
    ].filter(f => f).join('&')

    return `${baseUrl}/${basePath}?${filterParameters}`
  }

  useEffect(() => {
    // Only apply this if the use have not interact with the UI and the url is a sharable link
    if (query && Object.getOwnPropertyNames(query).length > 1 && query.shareCatalog && !interactionDetected) {
      setWithMaturity(query.withMaturity === 'true')
      setProductDeployable(query.productDeployable === 'true')
      parseQuery(query, 'origins', origins, setOrigins)
      parseQuery(query, 'countries', countries, setCountries)
      parseQuery(query, 'sectors', sectors, setSectors)
      parseQuery(query, 'organizations', organizations, setOrganizations)
      parseQuery(query, 'productTypes', productTypes, setProductTypes)
      parseQuery(query, 'sdgs', sdgs, setSDGs)
      parseQuery(query, 'tags', tags, setTags)
      parseQuery(query, 'useCases', useCases, setUseCases)
      parseQuery(query, 'workflows', workflows, setWorkflows)
      parseQuery(query, 'buildingBlocks', buildingBlocks, setBuildingBlocks)
      parseQuery(query, 'endorsers', endorsers, setEndorsers)
    }
  })

  return (
    <div className='px-2'>
      {
        filterDisplayed &&
          <div className='grid grid-cols-11 gap-4 pb-4 pt-2'>
            <div className='col-span-11 lg:col-span-5 border-transparent border-r lg:border-dial-purple-light'>
              <div className='text-sm text-dial-gray-light flex flex-row'>
                <div className='text-white text-xl px-2 pb-3'>
                  {format('filter.framework.title').toUpperCase()}
                </div>
              </div>
              <div className='text-sm text-dial-gray-light flex flex-row'>
                <div className='pl-2 pr-4 pb-2'>
                  {format('filter.framework.subTitle', { entity: format('product.header') })}
                </div>
              </div>
              <div className='text-sm text-dial-gray-light flex flex-row flex-wrap'>
                <SDGAutocomplete {...{ sdgs, setSDGs }} containerStyles='px-2 pb-2' />
                <UseCaseAutocomplete {...{ useCases, setUseCases }} containerStyles='px-2 pb-2' />
                <WorkflowAutocomplete {...{ workflows, setWorkflows }} containerStyles='px-2 pb-2' />
                <BuildingBlockAutocomplete {...{ buildingBlocks, setBuildingBlocks }} containerStyles='px-2 pb-2' />
                <TagAutocomplete {...{ tags, setTags }} containerStyles='px-2 pb-2' />
              </div>
            </div>
            <div className='col-span-11 lg:col-span-6'>
              <div className='text-white text-xl px-2 pb-3'>
                {format('filter.entity', { entity: format('product.label') }).toUpperCase()}
              </div>
              <div className='text-sm text-dial-gray-light flex flex-row'>
                <div className='px-2 pb-2'>
                  <label className='inline-flex items-center'>
                    <input
                      type='checkbox' className='h-4 w-4 form-checkbox text-white' name='with-maturity'
                      checked={forCovid} onChange={toggleForCovid}
                    />
                    <span className='ml-2'>{format('filter.product.forCovid')}</span>
                  </label>
                </div>
                <div className='px-2 pb-2'>
                  <label className='inline-flex items-center'>
                    <input
                      type='checkbox' className='h-4 w-4 form-checkbox text-white' name='with-maturity'
                      checked={withMaturity} onChange={toggleWithMaturity}
                    />
                    <span className='ml-2'>{format('filter.product.withMaturity')}</span>
                  </label>
                </div>
                <div className='px-2 pb-2 flex'>
                  <label className='inline-flex items-center'>
                    <input
                      type='checkbox' className='h-4 w-4 form-checkbox text-white' name='product-deployable'
                      checked={productDeployable} onChange={toggleProductDeployable}
                    />
                    <span className='ml-2'>{format('filter.product.launchable')}</span>
                  </label>
                </div>
              </div>
              <div className='text-sm text-dial-gray-light flex flex-row flex-wrap'>
                <OriginAutocomplete {...{ origins, setOrigins }} containerStyles='px-2 pb-2' />
                <EndorserAutocomplete {...{ endorsers, setEndorsers }} containerStyles='px-2 pb-2' />
                <ProductTypeSelect {...{ productTypes, setProductTypes }} containerStyles='px-2 pb-2' />
                <CountryAutocomplete {...{ countries, setCountries }} containerStyles='px-2 pb-2' />
                <SectorAutocomplete {...{ sectors, setSectors }} containerStyles='px-2 pb-2' />
                <OrganizationAutocomplete {...{ organizations, setOrganizations }} containerStyles='px-2 pb-2' />
              </div>
            </div>
          </div>
      }
      <div className={`flex flex-row pb-4 ${filterCount() > 0 ? 'block' : 'hidden'}`} id='link1'>
        <div className='px-2 py-1 mt-2 text-sm text-white whitespace-nowrap'>
          {format('filter.general.applied', { count: filterCount() })}:
        </div>
        <div className='flex flex-row flex-wrap gap-2'>
          {
            withMaturity &&
              <div className='px-2 py-1 my-auto rounded-md bg-dial-yellow text-sm text-dial-gray-dark'>
                {format('filter.product.withMaturity')}
                <MdClose className='ml-3 inline cursor-pointer' onClick={toggleWithMaturity} />
              </div>
          }
          {
            productDeployable &&
              <div className='px-2 py-1 my-auto rounded-md bg-dial-yellow text-sm text-dial-gray-dark'>
                {format('filter.product.launchable')}
                <MdClose className='ml-3 inline cursor-pointer' onClick={toggleProductDeployable} />
              </div>
          }
          <SDGFilters {...{ sdgs, setSDGs }} />
          <UseCaseFilters {...{ useCases, setUseCases }} />
          <WorkflowFilters {...{ workflows, setWorkflows }} />
          <BuildingBlockFilters {...{ buildingBlocks, setBuildingBlocks }} />
          <TagFilters {...{ tags, setTags }} />
          <OriginFilters {...{ origins, setOrigins }} />
          <EndorserFilters {...{ endorsers, setEndorsers }} />
          <ProductTypeFilters {...{ productTypes, setProductTypes }} />
          <CountryFilters {...{ countries, setCountries }} />
          <SectorFilters {...{ sectors, setSectors }} />
          <OrganizationFilters {...{ organizations, setOrganizations }} />

          <div className='flex px-2 py-1 mt-2 text-sm text-white'>
            <a className='border-b-2 border-transparent hover:border-dial-yellow my-auto' href='#clear-filter' onClick={clearFilter}>
              {format('filter.general.clearAll')}
            </a>
            <div className='border-r border-white mx-2 opacity-50' />
            <SharableLink sharableLink={sharableLink} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductFilter
