import { useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { QueryParamContext } from '../context/QueryParamContext'
import { ProjectFilterContext, ProjectFilterDispatchContext } from '../context/ProjectFilterContext'
import { CountryAutocomplete, CountryFilters } from '../filter/element/Country'
import { OrganizationAutocomplete, OrganizationFilters } from '../filter/element/Organization'
import { ProductAutocomplete, ProductFilters } from '../filter/element/Product'
import { OriginAutocomplete, OriginFilters } from '../filter/element/Origin'
import { SDGAutocomplete, SDGFilters } from '../filter/element/SDG'
import { TagAutocomplete, TagFilters } from '../filter/element/Tag'
import { SectorAutocomplete, SectorFilters } from '../filter/element/Sector'
import { parseQuery } from '../shared/SharableLink'
const SharableLink = dynamic(() => import('../shared/SharableLink'), { ssr: false })

const ProjectFilter = (props) => {
  const filterDisplayed = props.filterDisplayed

  const { query } = useRouter()
  const { interactionDetected } = useContext(QueryParamContext)

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  const { sectors, countries, organizations, products, origins, sdgs, tags } = useContext(ProjectFilterContext)
  const { setSectors, setCountries, setOrganizations, setProducts, setOrigins, setSDGs, setTags } = useContext(ProjectFilterDispatchContext)

  const filterCount = () => {
    return countries.length + organizations.length + products.length + sectors.length + origins.length + sdgs.length + tags.length
  }

  const clearFilter = (e) => {
    e.preventDefault()
    setOrigins([])
    setCountries([])
    setProducts([])
    setSectors([])
    setOrganizations([])
    setSDGs([])
    setTags([])
  }

  const sharableLink = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const basePath = 'projects'

    const originFilters = origins.map(origin => `origins=${origin.value}--${origin.label}`)
    const countryFilters = countries.map(country => `countries=${country.value}--${country.label}`)
    const productFilters = products.map(product => `products=${product.value}--${product.label}`)
    const sectorFilters = sectors.map(sector => `sectors=${sector.value}--${sector.label}`)
    const organizationFilters = organizations.map(organization => `organizations=${organization.value}--${organization.label}`)
    const sdgFilters = sdgs.map(sdg => `sdgs=${sdg.value}--${sdg.label}`)
    const tagFilters = tags.map(tag => `tags=${tag.value}--${tag.label}`)

    const activeFilter = 'shareCatalog=true'
    const filterParameters = [
      activeFilter, ...originFilters, ...countryFilters, ...productFilters, ...sectorFilters, ...organizationFilters,
      ...sdgFilters, ...tagFilters
    ].filter(f => f).join('&')

    return `${baseUrl}/${basePath}?${filterParameters}`
  }

  useEffect(() => {
    // Only apply this if the use have not interact with the UI and the url is a sharable link
    if (query && Object.getOwnPropertyNames(query).length > 1 && query.shareCatalog && !interactionDetected) {
      parseQuery(query, 'origins', origins, setOrigins)
      parseQuery(query, 'countries', countries, setCountries)
      parseQuery(query, 'products', products, setProducts)
      parseQuery(query, 'sectors', sectors, setSectors)
      parseQuery(query, 'organizations', organizations, setOrganizations)
      parseQuery(query, 'sdgs', sdgs, setSDGs)
      parseQuery(query, 'tags', tags, setTags)
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
                  {format('filter.framework.subTitle', { entity: format('project.header') })}
                </div>
              </div>
              <div className='text-sm text-dial-gray-light flex flex-row flex-wrap'>
                <SDGAutocomplete {...{ sdgs, setSDGs }} containerStyles='px-2 pb-2' />
              </div>
            </div>
            <div className='col-span-11 lg:col-span-6'>
              <div className='text-white text-xl px-2'>
                {format('filter.entity', { entity: format('project.label') }).toUpperCase()}
              </div>
              <div className='text-sm text-dial-gray-light flex flex-row flex-wrap'>
                <OriginAutocomplete {...{ origins, setOrigins }} containerStyles='px-2 pb-2' />
                <CountryAutocomplete {...{ countries, setCountries }} containerStyles='px-2 pb-2' />
                <SectorAutocomplete {...{ sectors, setSectors }} containerStyles='px-2 pb-2' />
                <ProductAutocomplete {...{ products, setProducts }} containerStyles='px-2 pb-2' />
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
        <div className='flex flex-row flex-wrap gap-2'>
          <SDGFilters {...{ sdgs, setSDGs }} />
          <OriginFilters {...{ origins, setOrigins }} />
          <CountryFilters {...{ countries, setCountries }} />
          <SectorFilters {...{ sectors, setSectors }} />
          <OrganizationFilters {...{ organizations, setOrganizations }} />
          <ProductFilters {...{ products, setProducts }} />
          <TagFilters {...{ tags, setTags }} />

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

export default ProjectFilter
