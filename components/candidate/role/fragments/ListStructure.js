import { useQuery } from '@apollo/client'
import { useContext } from 'react'
import { FilterContext } from '../../../context/FilterContext'
import { Error, Loading, NotFound } from '../../../shared/FetchStatus'
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
    }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.paginatedCandidateRoles) {
    return <NotFound />
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
