import classNames from 'classnames'
import { useQuery } from '@apollo/client'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { DPI_USER_DETAIL_QUERY } from '../../shared/query/user'
import UserDetail from '../users/UserDetail'
import DpiAdminTabs from './DpiAdminTabs'

const DpiAdminUserDetail = ({ userId }) => {
  const { loading, error, data } = useQuery(DPI_USER_DETAIL_QUERY, {
    variables: { userId }
  })

  return (
    <div className='px-4 lg:px-8 xl:px-56 h-[80vh] py-8'>
      <div className="md:flex md:h-full">
        <DpiAdminTabs />
        <div
          className={classNames(
            'py-6 px-8 text-medium',
            data && 'text-white bg-dial-slate-800',
            (loading || error) && 'bg-dial-alice-blue',
            'rounded-lg w-full min-h-[70vh]'
          )}
        >
          {loading && <Loading /> }
          {error && <Error />}
          {!data?.user && <NotFound />}
          {data && <UserDetail user={data.user} /> }
        </div>
      </div>
    </div>
  )
}

export default DpiAdminUserDetail
