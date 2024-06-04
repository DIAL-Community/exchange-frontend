import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useUser } from '../../../lib/hooks'
import DpiAdminTabs from './DpiAdminTabs'

const DpiAdminProfile = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user } =  useUser()

  return (
    <div className='px-4 lg:px-8 xl:px-56 min-h-[80vh] py-8'>
      <div className="md:flex md:h-full">
        <DpiAdminTabs />
        <div className="p-12 text-medium text-dial-slate-400 bg-dial-slate-800 rounded-lg w-full h-full">
          <div className='flex flex-col'>
            <div className='grid lg:grid-cols-2'>
              <div className='flex flex-col gap-8'>
                <div className='flex flex-col gap-3'>
                  <div className='text-lg text-dial-cotton'>
                    {format('profile.username')}
                  </div>
                  <div className='text-sm text-dial-cotton'>
                    {user?.userName}
                  </div>
                </div>
                <div className='flex flex-col gap-3'>
                  <div className='text-lg text-dial-cotton'>
                    {format('profile.email')}
                  </div>
                  <div className='text-sm text-dial-cotton'>
                    {user?.userEmail}
                  </div>
                </div>
              </div>
              <div className='flex flex-col gap-8'>
                <div className='flex flex-col gap-3'>
                  <div className='text-lg text-dial-cotton'>
                    {format('profile.roles')}
                  </div>
                  <div className='text-sm text-dial-cotton'>
                    {user?.roles.join(', ')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DpiAdminProfile
