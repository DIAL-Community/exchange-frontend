import { useRef } from 'react'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import Breadcrumb from '../shared/Breadcrumb'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../shared/GraphQueryHandler'
import { USER_DETAIL_QUERY } from '../shared/query/user'
import UserDetailLeft from './UserDetailLeft'
import UserDetailRight from './UserDetailRight'

const UserDetail = ({ userId }) => {
  const scrollRef = useRef(null)

  const { loading, error, data } = useQuery(USER_DETAIL_QUERY, {
    variables: { userId },
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
  } else if (!data?.user) {
    return handleMissingData()
  }

  const { user } = data

  const slugNameMapping = (() => {
    const map = {}
    map[user.id] = user.email

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-violet text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3'>
          <UserDetailLeft scrollRef={scrollRef} user={user} />
        </div>
        <div className='lg:basis-2/3'>
          <UserDetailRight ref={scrollRef} user={user} />
        </div>
      </div>
    </div>
  )
}

export default UserDetail
