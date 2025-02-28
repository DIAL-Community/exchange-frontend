import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { CollectionDisplayType, FilterContext } from '../../context/FilterContext'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../shared/GraphQueryHandler'
import { PAGINATED_DATASETS_QUERY } from '../../shared/query/dataset'
import { DisplayType } from '../../utils/constants'
import DatasetCard from '../DatasetCard'

const ListStructure = ({ pageOffset, pageSize }) => {
  const {
    search,
    collectionDisplayType,
    countries,
    datasetTypes,
    origins,
    sdgs,
    sectors,
    tags
  } = useContext(FilterContext)

  const { loading, error, data } = useQuery(PAGINATED_DATASETS_QUERY, {
    variables: {
      search,
      origins: origins.map(origin => origin.value),
      sdgs: sdgs.map(sdg => sdg.value),
      sectors: sectors.map(sector => sector.value),
      tags: tags.map(tag => tag.label),
      datasetTypes: datasetTypes.map(datasetType => datasetType.value),
      countries: countries.map(country => country.value),
      limit: pageSize,
      offset: pageOffset
    },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  if (loading) {
    return handleLoadingQuery()
  } else if (error) {
    return handleQueryError(error)
  } else if (!data?.paginatedDatasets) {
    return handleMissingData()
  }

  const listDisplay = (datasets) => (
    <div className='flex flex-col gap-3'>
      {datasets.map((dataset, index) =>
        <div key={index}>
          <DatasetCard
            index={index}
            dataset={dataset}
            displayType={DisplayType.LARGE_CARD}
          />
        </div>
      )}
    </div>
  )

  const gridDisplay = (datasets) => (
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
      {datasets.map((dataset, index) =>
        <div key={index}>
          <DatasetCard
            index={index}
            dataset={dataset}
            displayType={DisplayType.GRID_CARD}
          />
        </div>
      )}
    </div>
  )

  const { paginatedDatasets: datasets } = data

  return collectionDisplayType === CollectionDisplayType.LIST
    ? listDisplay(datasets)
    : gridDisplay(datasets)
}

export default ListStructure
