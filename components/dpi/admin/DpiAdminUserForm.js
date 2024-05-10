import classNames from 'classnames'
import { useQuery } from '@apollo/client'
import { Error, Loading } from '../../shared/FetchStatus'
import { USER_DETAIL_QUERY } from '../../shared/query/user'
import UserForm from '../users/UserForm'
import DpiAdminTabs from './DpiAdminTabs'

const DpiAdminUserForm = ({ userId }) => {
  const { loading, error, data } = useQuery(USER_DETAIL_QUERY, {
    variables: { userId }
  })

  return (
    <div className='px-4 lg:px-8 xl:px-56 h-[80vh] py-8'>
      <div className="md:flex md:h-full">
        <DpiAdminTabs />
        <div
          className={classNames(
            'py-6 px-8 text-medium',
            (!userId || data) && 'text-white bg-dial-slate-800',
            (loading || error) && 'bg-dial-alice-blue',
            'rounded-lg w-full min-h-[70vh]'
          )}
        >
          {loading && <Loading /> }
          {userId
            ? data
              ? <UserForm user={data.user} />
              : <Error />
            : <UserForm />
          }
        </div>
      </div>
    </div>
  )
}

export default DpiAdminUserForm
