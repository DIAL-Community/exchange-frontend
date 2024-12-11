import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { CollectionDisplayType, FilterContext } from '../../context/FilterContext'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../shared/GraphQueryHandler'
import { PAGINATED_BUILDING_BLOCKS_QUERY } from '../../shared/query/buildingBlock'
import { DisplayType } from '../../utils/constants'
import BuildingBlockCard from '../BuildingBlockCard'

const ListStructure = ({ pageOffset, pageSize }) => {
  const {
    search,
    collectionDisplayType,
    sdgs,
    useCases,
    workflows,
    categoryTypes,
    showMature,
    showGovStackOnly
  } = useContext(FilterContext)

  const { loading, error, data } = useQuery(PAGINATED_BUILDING_BLOCKS_QUERY, {
    variables: {
      search,
      sdgs: sdgs.map(sdg => sdg.value),
      useCases: useCases.map(useCase => useCase.value),
      workflows: workflows.map(workflow => workflow.value),
      categoryTypes: categoryTypes.map(categoryType => categoryType.value),
      showMature,
      showGovStackOnly,
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
  } else if (!data?.paginatedBuildingBlocks) {
    return handleMissingData()
  }

  const listDisplay = (buildingBlocks) => (
    <div className='flex flex-col gap-3'>
      {buildingBlocks.map((buildingBlock, index) =>
        <div key={index}>
          <BuildingBlockCard
            index={index}
            buildingBlock={buildingBlock}
            displayType={DisplayType.LARGE_CARD}
          />
        </div>
      )}
    </div>
  )

  const gridDisplay = (buildingBlocks) => (
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4'>
      {buildingBlocks.map((buildingBlock, index) =>
        <div key={index}>
          <BuildingBlockCard
            index={index}
            buildingBlock={buildingBlock}
            displayType={DisplayType.GRID_CARD}
          />
        </div>
      )}
    </div>
  )

  const { paginatedBuildingBlocks: buildingBlocks } = data

  return collectionDisplayType === CollectionDisplayType.LIST
    ? listDisplay(buildingBlocks)
    : gridDisplay(buildingBlocks)
}

export default ListStructure
