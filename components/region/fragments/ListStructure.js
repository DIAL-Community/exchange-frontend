import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { FilterContext } from '../../context/FilterContext'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../shared/GraphQueryHandler'
import { PAGINATED_REGIONS_QUERY } from '../../shared/query/region'
import { DisplayType } from '../../utils/constants'
import RegionCard from '../RegionCard'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const { search } = useContext(FilterContext)

  const { loading, error, data } = useQuery(PAGINATED_REGIONS_QUERY, {
    variables: {
      search,
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
  } else if (!data?.paginatedRegions) {
    return handleMissingData()
  }

  const { paginatedRegions: regions } = data

  return (
    <div className='flex flex-col gap-3'>
      {regions.map((region, index) =>
        <div key={index}>
          <RegionCard
            index={index}
            region={region}
            displayType={DisplayType.LARGE_CARD}
          />
        </div>
      )}
    </div>
  )
}

export default ListStructure
