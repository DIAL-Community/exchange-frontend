import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { SIMPLE_USER_DETAIL_QUERY } from '../../shared/query/user'
import UserForm from '../users/UserForm'
import HubAdminTabs from './HubAdminTabs'

const HubAdminUserForm = ({ userId }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, data, error } = useQuery(SIMPLE_USER_DETAIL_QUERY, {
    variables: { userId },
    skip: !userId
  })

  return (
    <div className='px-4 lg:px-8 xl:px-56 min-h-[80vh] py-8'>
      <div className='md:flex md:h-full'>
        <HubAdminTabs />
        <div className='text-dial-slate-400 bg-dial-slate-800 rounded-lg w-full h-full'>
          <div className='p-6 lg:p-12'>
            {loading
              ? format('general.fetchingData')
              : error
                ? format('general.fetchError')
                : userId && data.user
                  ? <UserForm user={data?.user} />
                  : <UserForm />
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default HubAdminUserForm
