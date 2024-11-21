import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { FilterContext } from '../../context/FilterContext'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../shared/GraphQueryHandler'
import { PAGINATED_CANDIDATE_STATUSES_QUERY } from '../../shared/query/candidateStatus'
import { DisplayType } from '../../utils/constants'
import CandidateStatusCard from '../CandidateStatusCard'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const { search } = useContext(FilterContext)

  const { loading, error, data } = useQuery(PAGINATED_CANDIDATE_STATUSES_QUERY, {
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
  } else if (!data?.paginatedCandidateStatuses) {
    return handleMissingData()
  }

  const { paginatedCandidateStatuses: candidateStatuses } = data

  return (
    <div className='flex flex-col gap-3'>
      {candidateStatuses.map((candidateStatus, index) =>
        <div key={index}>
          <CandidateStatusCard
            index={index}
            candidateStatus={candidateStatus}
            displayType={DisplayType.LARGE_CARD}
          />
        </div>
      )}
    </div>
  )
}

export default ListStructure
