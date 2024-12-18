import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../../lib/apolloClient'
import { FilterContext } from '../../../context/FilterContext'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../../shared/GraphQueryHandler'
import { PAGINATED_CANDIDATE_ROLES_QUERY } from '../../../shared/query/candidateRole'
import { DisplayType } from '../../../utils/constants'
import RoleCard from '../RoleCard'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const { search } = useContext(FilterContext)

  const { loading, error, data } = useQuery(PAGINATED_CANDIDATE_ROLES_QUERY, {
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
  } else if (!data?.paginatedCandidateRoles) {
    return handleMissingData()
  }

  const { paginatedCandidateRoles: roles } = data

  return (
    <div className='flex flex-col gap-3'>
      {roles.map((role, index) =>
        <div key={index}>
          <RoleCard
            index={index}
            role={role}
            displayType={DisplayType.LARGE_CARD}
          />
        </div>
      )}
    </div>
  )
}

export default ListStructure
