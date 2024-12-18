import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { FilterContext } from '../../context/FilterContext'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../shared/GraphQueryHandler'
import { PAGINATED_BUILDING_BLOCKS_QUERY } from '../../shared/query/buildingBlock'
import { DisplayType } from '../../utils/constants'
import BuildingBlockCard from '../BuildingBlockCard'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const {
    search,
    showMature,
    showGovStackOnly,
    sdgs,
    useCases,
    workflows,
    categoryTypes
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
      limit: defaultPageSize,
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

  const { paginatedBuildingBlocks: buildingBlocks } = data

  return (
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
}

export default ListStructure
