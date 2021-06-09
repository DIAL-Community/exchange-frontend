import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { MdClose } from 'react-icons/md'

import { ProductFilterContext, ProductFilterDispatchContext } from '../context/ProductFilterContext'
import { BuildingBlockAutocomplete, BuildingBlockFilters } from './element/BuildingBlock'
import { CountryAutocomplete, CountryFilters } from './element/Country'
import { OrganizationAutocomplete, OrganizationFilters } from './element/Organization'
import { OriginAutocomplete, OriginFilters } from './element/Origin'
import { ProductTypeFilters, ProductTypeSelect } from './element/ProductType'
import { SDGAutocomplete, SDGFilters } from './element/SDG'
import { TagAutocomplete, TagFilters } from './element/Tag'
import { SectorAutocomplete, SectorFilters } from './element/Sector'
import { UseCaseAutocomplete, UseCaseFilters } from './element/UseCase'
import { WorkflowAutocomplete, WorkflowFilters } from './element/Workflow'

const ProductFilter = (props) => {
  const openFilter = props.openFilter

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const {
    withMaturity, productDeployable, sectors, countries, organizations, origins, sdgs, tags,
    useCases, workflows, buildingBlocks, productTypes
  } = useContext(ProductFilterContext)
  const {
    setWithMaturity, setProductDeployable, setSectors, setCountries, setOrganizations,
    setOrigins, setSDGs, setTags, setUseCases, setWorkflows, setBuildingBlocks, setProductTypes
  } = useContext(ProductFilterDispatchContext)

  const toggleWithMaturity = () => {
    setWithMaturity(!withMaturity)
  }

  const toggleProductDeployable = () => {
    setProductDeployable(!productDeployable)
  }

  const filterCount = () => {
    let count = 0
    count = withMaturity ? count + 1 : count
    count = productDeployable ? count + 1 : count
    count = count + countries.length + organizations.length + tags.length +
      sectors.length + origins.length + sdgs.length + useCases.length +
      workflows.length + buildingBlocks.length + productTypes.length
    return count
  }

  const clearFilter = (e) => {
    e.preventDefault()
    setWithMaturity(false)
    setProductDeployable(false)
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
  }

  return (
    <div className='px-2'>
      {
        openFilter &&
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
                <ProductTypeSelect {...{ productTypes, setProductTypes }} containerStyles='px-2 pb-2' />
                <CountryAutocomplete {...{ countries, setCountries }} containerStyles='px-2 pb-2' />
                <SectorAutocomplete {...{ sectors, setSectors }} containerStyles='px-2 pb-2' />
                <OrganizationAutocomplete {...{ organizations, setOrganizations }} containerStyles='px-2 pb-2' />
                <TagAutocomplete {...{ tags, setTags }} containerStyles='px-2 pb-2' />
              </div>
            </div>
          </div>
      }
      <div className={`flex flex-row pb-4 ${filterCount() > 0 ? 'block' : 'hidden'}`} id='link1'>
        <div className='px-2 py-1 mt-2 text-sm text-white whitespace-nowrap'>
          {format('filter.general.applied', { count: filterCount() })}:
        </div>
        <div className='flex flex-row flex-wrap'>
          {
            withMaturity &&
              <div className='px-2 py-1 mt-2 mr-2 rounded-md bg-dial-yellow text-sm text-dial-gray-dark'>
                {format('filter.product.withMaturity')}
                <MdClose className='ml-3 inline cursor-pointer' onClick={toggleWithMaturity} />
              </div>
          }
          {
            productDeployable &&
              <div className='px-2 py-1 mt-2 mr-2 rounded-md bg-dial-yellow text-sm text-dial-gray-dark'>
                {format('filter.product.launchable')}
                <MdClose className='ml-3 inline cursor-pointer' onClick={toggleProductDeployable} />
              </div>
          }
          <OriginFilters {...{ origins, setOrigins }} />
          <ProductTypeFilters {...{ productTypes, setProductTypes }} />
          <CountryFilters {...{ countries, setCountries }} />
          <SectorFilters {...{ sectors, setSectors }} />
          <OrganizationFilters {...{ organizations, setOrganizations }} />
          <BuildingBlockFilters {...{ buildingBlocks, setBuildingBlocks }} />
          <WorkflowFilters {...{ workflows, setWorkflows }} />
          <UseCaseFilters {...{ useCases, setUseCases }} />
          <SDGFilters {...{ sdgs, setSDGs }} />
          <TagFilters {...{ tags, setTags }} />
          {
            filterCount() > 0 &&
              <a className='px-2 py-1  mt-2 text-sm text-white' href='#clear-filter' onClick={clearFilter}>
                {format('filter.general.clearAll')}
              </a>
          }
        </div>
      </div>
    </div>
  )
}

export default ProductFilter
