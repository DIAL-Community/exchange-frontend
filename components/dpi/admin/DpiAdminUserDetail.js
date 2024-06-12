import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { SIMPLE_USER_DETAIL_QUERY } from '../../shared/query/user'
import ProfileDetail from '../users/ProfileDetail'
import DpiAdminTabs from './DpiAdminTabs'

const DpiAdminUserDetail = ({ userId }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, data, error } = useQuery(SIMPLE_USER_DETAIL_QUERY, {
    variables: { userId }
  })

  return (
    <div className='px-4 lg:px-8 xl:px-56 min-h-[80vh] py-8'>
      <div className="md:flex md:h-full">
        <DpiAdminTabs />
        <div className="p-12 text-medium text-dial-slate-400 bg-dial-slate-800 rounded-lg w-full h-full">
          {loading
            ? format('general.fetchingData')
            : error
              ? format('general.fetchError')
              : userId && data.user
                ? <ProfileDetail user={data?.user} />
                : format('app.notFound')
          }
        </div>
      </div>
    </div>
  )
}

export default DpiAdminUserDetail
