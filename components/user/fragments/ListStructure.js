import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { FilterContext } from '../../context/FilterContext'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../shared/GraphQueryHandler'
import { PAGINATED_USERS_QUERY } from '../../shared/query/user'
import { DisplayType } from '../../utils/constants'
import UserCard from '../UserCard'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const { search } = useContext(FilterContext)
  const { loading, error, data } = useQuery(PAGINATED_USERS_QUERY, {
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
  } else if (!data?.paginatedUsers) {
    return handleMissingData()
  }

  const { paginatedUsers: users } = data

  return (
    <div className='flex flex-col gap-3'>
      {users.map((user, index) =>
        <div key={index}>
          <UserCard
            index={index}
            user={user}
            displayType={DisplayType.LARGE_CARD}
          />
        </div>
      )}
    </div>
  )
}

export default ListStructure
