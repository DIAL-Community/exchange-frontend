import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { PAGINATED_CANDIDATE_STATUSES_QUERY } from '../../shared/query/candidateStatus'
import CandidateStatusCard from '../CandidateStatusCard'
import { DisplayType } from '../../utils/constants'
import { FilterContext } from '../../context/FilterContext'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const { search } = useContext(FilterContext)

  const { loading, error, data } = useQuery(PAGINATED_CANDIDATE_STATUSES_QUERY, {
    variables: {
      search,
      limit: defaultPageSize,
      offset: pageOffset
    }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.paginatedCandidateStatuses) {
    return <NotFound />
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
