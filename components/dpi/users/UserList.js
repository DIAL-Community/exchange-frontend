import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { UserFilterContext } from '../../context/UserFilterContext'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { PAGINATED_USERS_QUERY } from '../../shared/query/user'
import UserCard from './UserCard'

const UserList = ({ pageOffset, defaultPageSize }) => {
  const { search } = useContext(UserFilterContext)
  const { loading, error, data } = useQuery(PAGINATED_USERS_QUERY, {
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
