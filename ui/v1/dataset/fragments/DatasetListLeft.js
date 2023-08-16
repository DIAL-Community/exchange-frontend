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

  const {
    isEndorsed, datasetDeployable, sectors, countries, datasets, origins, sdgs, tags,
    useCases, workflows, buildingBlocks, endorsers, licenseTypes, isLinkedWithDpi
  } = useContext(DatasetFilterContext)

  const {
    setIsEndorsed, setDatasetDeployable, setSectors, setCountries, setDatasets,
    setOrigins, setSDGs, setTags, setUseCases, setWorkflows, setBuildingBlocks, setEndorsers,
    setLicenseTypes, setIsLinkedWithDpi
  } = useContext(DatasetFilterDispatchContext)

  const sharableLink = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const basePath = '/datasets'

    const endorsedFilter = isEndorsed ? 'isEndorsed=true' : ''
    const deployableFilter = datasetDeployable ? 'datasetDeployable=true' : ''
    const originFilters = origins.map(origin => `origins=${origin.value}--${origin.label}`)
    const countryFilters = countries.map(country => `countries=${country.value}--${country.label}`)
    const sectorFilters = sectors.map(sector => `sectors=${sector.value}--${sector.label}`)
    const datasetFilters = datasets.map(
      dataset => `datasets=${dataset.value}--${dataset.label}`
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
      ...countryFilters, ...sectorFilters, ...datasetFilters, ...sdgFilters, ...tagFilters,
      ...useCaseFilters, ...workflowFilters, ...buildingBlockFilters, ...endorserFilters, linkedWithDpiFilter
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
      setDatasetDeployable(query.datasetDeployable === 'true')
      parseQuery(query, 'licenseTypes', licenseTypes, setLicenseTypes)
      parseQuery(query, 'origins', origins, setOrigins)
      parseQuery(query, 'countries', countries, setCountries)
      parseQuery(query, 'sectors', sectors, setSectors)
      parseQuery(query, 'datasets', datasets, setDatasets)
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
    <div className='bg-dial-slate-100 h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <DatasetFilter />
        <hr className='bg-slate-200' />
        <Bookmark sharableLink={sharableLink} objectType={ObjectType.URL} />
        <hr className='bg-slate-200' />
        <Share />
        <hr className='bg-slate-200' />
      </div>
    </div>
  )
}

export default DatasetListLeft
