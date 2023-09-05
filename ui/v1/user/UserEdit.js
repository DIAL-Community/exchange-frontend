import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { USER_DETAIL_QUERY } from '../shared/query/user'
import Breadcrumb from '../shared/Breadcrumb'
import { Error, Loading, NotFound } from '../shared/FetchStatus'
import UserForm from './fragments/UserForm'
import UserEditLeft from './UserEditLeft'

const UserEdit = ({ userId }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data } = useQuery(USER_DETAIL_QUERY, {
    variables: { userId }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.user) {
    return <NotFound />
  }

  const { user } = data

  const slugNameMapping = (() => {
    const map = {
      edit: format('app.edit')
    }
    map[user.id] = user.email

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-blue-chalk text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3'>
          <UserEditLeft user={user} />
        </div>
        <div className='lg:basis-2/3'>
          <UserForm user={user} />
        </div>
      </div>
    </div>
  )
}

export default UserEdit
