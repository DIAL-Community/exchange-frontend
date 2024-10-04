import { useQuery } from '@apollo/client'
import { useContext } from 'react'
import { FilterContext } from '../../context/FilterContext'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
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
