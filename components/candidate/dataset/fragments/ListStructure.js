import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../../lib/apolloClient'
import { FilterContext } from '../../../context/FilterContext'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../../shared/GraphQueryHandler'
import { PAGINATED_CANDIDATE_DATASETS_QUERY } from '../../../shared/query/candidateDataset'
import { DisplayType } from '../../../utils/constants'
import DatasetCard from '../DatasetCard'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const { search } = useContext(FilterContext)

  const { loading, error, data } = useQuery(PAGINATED_CANDIDATE_DATASETS_QUERY, {
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
  } else if (!data?.paginatedCandidateDatasets) {
    return handleMissingData()
  }

  const { paginatedCandidateDatasets: datasets } = data

  return (
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
}

export default ListStructure
