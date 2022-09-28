import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import dynamic from 'next/dynamic'
import { QueryParamContext } from '../context/QueryParamContext'
import { ProjectFilterContext, ProjectFilterDispatchContext } from '../context/ProjectFilterContext'
import { SDGFilters } from '../filter/element/SDG'
import { parseQuery } from '../shared/SharableLink'
import { OriginFilters } from '../filter/element/Origin'
import { CountryFilters } from '../filter/element/Country'
import { SectorFilters } from '../filter/element/Sector'
import { OrganizationFilters } from '../filter/element/Organization'
import { ProductFilters } from '../filter/element/Product'
import { TagFilters } from '../filter/element/Tag'
const SharableLink = dynamic(() => import('../shared/SharableLink'), { ssr: false })

const ProjectActiveFilter = () => {
  const { query } = useRouter()
  const { interactionDetected } = useContext(QueryParamContext)

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

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
    <div className={`flex flex-row pt-2 ${filterCount() > 0 ? 'block' : 'hidden'}`} id='link1'>
      <div className='flex flex-row flex-wrap px-3 gap-2'>
        <SDGFilters {...{ sdgs, setSDGs }} />
        <OriginFilters {...{ origins, setOrigins }} />
        <CountryFilters {...{ countries, setCountries }} />
        <SectorFilters {...{ sectors, setSectors }} />
        <OrganizationFilters {...{ organizations, setOrganizations }} />
        <ProductFilters {...{ products, setProducts }} />
        <TagFilters {...{ tags, setTags }} />

        <div className='flex px-2 py-1 mt-2 text-sm text-dial-gray-dark'>
          <a
            className='border-b-2 border-transparent hover:border-dial-yellow opacity-50'
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

export default ProjectActiveFilter
