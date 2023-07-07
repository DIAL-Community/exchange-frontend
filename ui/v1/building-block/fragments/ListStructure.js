import { useContext, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { Error, Loading } from '../../../../components/shared/FetchStatus'
import { PAGINATED_BUILDING_BLOCKS_QUERY } from '../../shared/query/buildingBlock'
import { BuildingBlockFilterContext } from '../../../../components/context/BuildingBlockFilterContext'
import BuildingBlockCard from '../BuildingBlockCard'
import { DisplayType } from '../../utils/constants'
import { FilterContext } from '../../../../components/context/FilterContext'
import { NotFound } from '../../shared/FetchStatus'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const { setResultCounts } = useContext(FilterContext)
  const { search } = useContext(BuildingBlockFilterContext)

  const { loading, error, data, fetchMore } = useQuery(PAGINATED_BUILDING_BLOCKS_QUERY, {
    variables: {
      search,
      limit: defaultPageSize,
      offset: pageOffset
    },
    onCompleted: (data) => {
      setResultCounts(resultCount => {
        return { ...resultCount, 'filter.entity.buildingBlocks': data.paginatedBuildingBlocks.length }
      })
    }
  })

  useEffect(() => {
    fetchMore({
      variables: {
        search,
        limit: defaultPageSize,
        offset: pageOffset
      }
    })
  }, [search, pageOffset, defaultPageSize, fetchMore])

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
