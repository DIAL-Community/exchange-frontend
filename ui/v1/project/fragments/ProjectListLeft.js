import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import Bookmark from '../../shared/common/Bookmark'
import Comment from '../../shared/common/Comment'
import Share from '../../shared/common/Share'
import { ObjectType, REBRAND_BASE_PATH } from '../../utils/constants'
import {
  ProjectFilterContext,
  ProjectFilterDispatchContext
} from '../../../../components/context/ProjectFilterContext'
import { parseQuery } from '../../utils/share'
import { QueryParamContext } from '../../../../components/context/QueryParamContext'
import ProjectFilter from './ProjectFilter'

const ProjectListLeft = () => {
  const { query } = useRouter()
  const { interactionDetected } = useContext(QueryParamContext)

  const { countries, products, organizations, sectors, tags } = useContext(ProjectFilterContext)
  const { sdgs, origins } = useContext(ProjectFilterContext)

  const { setCountries, setProducts, setOrganizations, setSectors, setTags } = useContext(ProjectFilterDispatchContext)
  const { setSdgs, setOrigins } = useContext(ProjectFilterDispatchContext)

  const sharableLink = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const basePath = `${REBRAND_BASE_PATH}/projects`

    const countryFilters = countries.map(country => `countries=${country.value}--${country.label}`)
    const productFilters = products.map(product => `countries=${product.value}--${product.label}`)
    const organizationFilters = organizations.map(
      organization => `organizations=${organization.value}--${organization.label}`
    )
    const sectorFilters = sectors.map(sector => `sectors=${sector.value}--${sector.label}`)
    const tagFilters = tags.map(tag => `tags=${tag.value}--${tag.label}`)

    const originFilters = origins.map(origin => `origins=${origin.value}--${origin.label}`)
    const sdgFilters = sdgs.map(sdg => `sdgs=${sdg.value}--${sdg.label}`)

    const activeFilter = 'shareCatalog=true'
    const filterParameters = [
      activeFilter,
      ...countryFilters,
      ...productFilters,
      ...organizationFilters,
      ...sectorFilters,
      ...tagFilters,
      ...sdgFilters,
      ...originFilters
    ].filter(f => f).join('&')

    return `${baseUrl}${basePath}?${filterParameters}`
  }

  useEffect(() => {
    // Only apply this if the use have not interact with the UI and the url is a sharable link
    const filtered = query && Object.getOwnPropertyNames(query).length > 1 && query.shareCatalog
    if (filtered && !interactionDetected) {
      parseQuery(query, 'countries', countries, setCountries)
      parseQuery(query, 'products', products, setProducts)
      parseQuery(query, 'organizations', organizations, setOrganizations)
      parseQuery(query, 'sectors', sectors, setSectors)
      parseQuery(query, 'tags', tags, setTags)

      parseQuery(query, 'origins', origins, setOrigins)
      parseQuery(query, 'sdgs', sdgs, setSdgs)
    }
  })

  return (
    <div className='bg-dial-slate-100 h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <ProjectFilter />
        <hr className='bg-slate-200' />
        <Bookmark sharableLink={sharableLink} objectType={ObjectType.URL} />
        <hr className='bg-slate-200' />
        <Share />
        <hr className='bg-slate-200' />
        <Comment />
        <hr className='bg-slate-200' />
      </div>
    </div>
  )
}

export default ProjectListLeft
