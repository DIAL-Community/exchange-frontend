import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { PAGINATED_BUILDING_BLOCKS_QUERY } from '../../shared/query/buildingBlock'
import { BuildingBlockFilterContext } from '../../context/BuildingBlockFilterContext'
import BuildingBlockCard from '../BuildingBlockCard'
import { DisplayType } from '../../utils/constants'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'

const ListStructure = ({ defaultPageSize }) => {
  const { showMature, showGovStackOnly } = useContext(BuildingBlockFilterContext)
  const { search, sdgs, useCases, workflows, categoryTypes } = useContext(BuildingBlockFilterContext)

  const { pageOffset } = useContext(BuildingBlockFilterContext)

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
    }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.paginatedBuildingBlocks) {
    return <NotFound />
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
