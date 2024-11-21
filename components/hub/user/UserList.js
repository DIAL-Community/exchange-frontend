import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { FilterContext } from '../../context/FilterContext'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../shared/GraphQueryHandler'
import { PAGINATED_DPI_USERS_QUERY } from '../../shared/query/user'
import { DEFAULT_PAGE_SIZE } from './constant'
import UserCard from './UserCard'

const UserList = ({ pageNumber }) => {
  const { search } = useContext(FilterContext)
  const { loading, error, data } = useQuery(PAGINATED_DPI_USERS_QUERY, {
    variables: {
      search,
      roles: ['adli_admin', 'adli_user'],
      limit: DEFAULT_PAGE_SIZE,
      offset: pageNumber * DEFAULT_PAGE_SIZE
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
    <div className='flex flex-col gap-2'>
      {users.map((user, index) =>
        <div className='flex flex-col gap-y-2' key={index}>
          <hr className='border-b border-gray-300 border-dashed' />
          <UserCard key={index} user={user} />
        </div>
      )}
    </div>
  )
}

export default UserList
