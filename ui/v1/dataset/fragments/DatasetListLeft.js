import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import Bookmark from '../../shared/common/Bookmark'
import Share from '../../shared/common/Share'
import { ObjectType } from '../../utils/constants'
import {
  DatasetFilterContext,
  DatasetFilterDispatchContext
} from '../../../../components/context/DatasetFilterContext'
import { parseQuery } from '../../utils/share'
import { QueryParamContext } from '../../../../components/context/QueryParamContext'
import DatasetFilter from './DatasetFilter'

const DatasetListLeft = () => {
  const { query } = useRouter()
  const { interactionDetected } = useContext(QueryParamContext)

  const { sectors, tags, sdgs, origins, datasetTypes } = useContext(DatasetFilterContext)
  const { setSectors, setTags, setSdgs, setOrigins, setDatasetTypes } = useContext(DatasetFilterDispatchContext)

  const sharableLink = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const basePath = '/datasets'

    const typeFilters = datasetTypes.map(datasetType => `types=${datasetType.value}--${datasetType.label}`)
    const originFilters = origins.map(origin => `origins=${origin.value}--${origin.label}`)
    const sectorFilters = sectors.map(sector => `sectors=${sector.value}--${sector.label}`)
    const sdgFilters = sdgs.map(sdg => `sdgs=${sdg.value}--${sdg.label}`)
    const tagFilters = tags.map(tag => `tags=${tag.value}--${tag.label}`)

    const activeFilter = 'shareCatalog=true'
    const filterParameters = [
      activeFilter, ...typeFilters, ...originFilters, ...sectorFilters, ...sdgFilters, ...tagFilters
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
        <hr className='border-b border-dial-slate-200'/>
        <Share />
        <hr className='border-b border-dial-slate-200'/>
      </div>
    </div>
  )
}

export default DatasetListLeft
