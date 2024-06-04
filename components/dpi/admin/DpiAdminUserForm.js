import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { DPI_USER_DETAIL_QUERY } from '../../shared/query/user'
import UserForm from '../users/UserForm'
import DpiAdminTabs from './DpiAdminTabs'

const DpiAdminUserForm = ({ userId }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, data } = useQuery(DPI_USER_DETAIL_QUERY, {
    variables: { userId }
  })

  return (
    <div className='px-4 lg:px-8 xl:px-56 h-[80vh] py-8'>
      <div className="md:flex md:h-full">
        <DpiAdminTabs />
        <div className="p-12 text-medium text-dial-slate-400 bg-dial-slate-800 rounded-lg w-full h-full">
          {loading && format('general.fetchingData') }
          {userId
            ? data
              ? <UserForm user={data?.user} />
              : format('general.fetchError')
            : <UserForm />
          }
        </div>
      </div>
    </div>
  )
}

export default DpiAdminUserForm
