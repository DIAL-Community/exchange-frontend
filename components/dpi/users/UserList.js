import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { UserFilterContext } from '../../context/UserFilterContext'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { PAGINATED_DPI_USERS_QUERY } from '../../shared/query/user'
import { DEFAULT_PAGE_SIZE } from './constant'
import UserCard from './UserCard'

const UserList = ({ pageNumber }) => {
  const { search } = useContext(UserFilterContext)
  const { loading, error, data } = useQuery(PAGINATED_DPI_USERS_QUERY, {
    variables: {
      search,
      roles: ['adli_admin', 'adli_user'],
      limit: DEFAULT_PAGE_SIZE,
      offset: pageNumber * DEFAULT_PAGE_SIZE
    }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.paginatedUsers) {
    return <NotFound />
  }

  const { paginatedUsers: users } = data

  return (
    <div className='flex flex-col gap-3'>
      {users.map((user, index) => <UserCard key={index} index={index} user={user} />)}
    </div>
  )
}

export default UserList
