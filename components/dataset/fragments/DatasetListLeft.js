import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { FilterContext, FilterDispatchContext } from '../../context/FilterContext'
import { QueryParamContext } from '../../context/QueryParamContext'
import Bookmark from '../../shared/common/Bookmark'
import Share from '../../shared/common/Share'
import { ObjectType } from '../../utils/constants'
import { parseQuery } from '../../utils/share'
import DatasetFilter from './DatasetFilter'

const DatasetListLeft = () => {
  const { query } = useRouter()
  const { interactionDetected } = useContext(QueryParamContext)

  const {
    countries,
    datasetTypes,
    origins,
    sdgs,
    sectors,
    tags
  } = useContext(FilterContext)

  const {
    setCountries,
    setDatasetTypes,
    setOrigins,
    setSdgs,
    setSectors,
    setTags
  } = useContext(FilterDispatchContext)

  const sharableLink = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const basePath = '/datasets'

    const countryFilters = countries.map(country => `countries=${country.value}--${country.label}`)
    const typeFilters = datasetTypes.map(datasetType => `types=${datasetType.value}--${datasetType.label}`)
    const originFilters = origins.map(origin => `origins=${origin.value}--${origin.label}`)
    const sdgFilters = sdgs.map(sdg => `sdgs=${sdg.value}--${sdg.label}`)
    const sectorFilters = sectors.map(sector => `sectors=${sector.value}--${sector.label}`)
    const tagFilters = tags.map(tag => `tags=${tag.value}--${tag.label}`)

    const activeFilter = 'shareCatalog=true'
    const filterParameters = [
      activeFilter,
      ...countryFilters,
      ...typeFilters,
      ...originFilters,
      ...sdgFilters,
      ...sectorFilters,
      ...tagFilters
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
      parseQuery(query, 'countries', countries, setCountries)
      parseQuery(query, 'types', datasetTypes, setDatasetTypes)
      parseQuery(query, 'origins', origins, setOrigins)
      parseQuery(query, 'sectors', sectors, setSectors)
      parseQuery(query, 'sdgs', sdgs, setSdgs)
      parseQuery(query, 'tags', tags, setTags)
    }
  })

  return (
    <div className='bg-dial-slate-100 h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <DatasetFilter />
        <Bookmark sharableLink={sharableLink} objectType={ObjectType.URL} />
        <hr className='border-b border-dial-slate-200' />
        <Share />
        <hr className='border-b border-dial-slate-200' />
      </div>
    </div>
  )
}

export default DatasetListLeft
