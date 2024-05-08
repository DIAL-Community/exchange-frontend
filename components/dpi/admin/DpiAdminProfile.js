import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useUser } from '../../../lib/hooks'
import DpiAdminTabs from './DpiAdminTabs'

const DpiAdminProfile = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user } =  useUser()

  return (
    <div className='px-4 lg:px-8 xl:px-56 h-[80vh] py-8'>
      <div class="md:flex md:h-full">
        <DpiAdminTabs />
        <div class="p-12 text-medium text-dial-slate-400 bg-dial-slate-800 rounded-lg w-full h-full">
          <div className='flex flex-col'>
            <div className='grid lg:grid-cols-2'>
              <div className='flex flex-col gap-8'>
                <div className='flex flex-col gap-3'>
                  <div className='text-lg text-white'>
                    {format('profile.username')}
                  </div>
                  <div className='text-sm text-white'>
                    {user?.userName}
                  </div>
                </div>
                <div className='flex flex-col gap-3'>
                  <div className='text-lg text-white'>
                    {format('profile.email')}
                  </div>
                  <div className='text-sm text-white'>
                    {user?.userEmail}
                  </div>
                </div>
              </div>
              <div className='flex flex-col gap-8'>
                <div className='flex flex-col gap-3'>
                  <div className='text-lg text-white'>
                    {format('profile.roles')}
                  </div>
                  <div className='text-sm text-white'>
                    {user?.roles.join(', ')}
                  </div>
                </div>
                <div className='flex flex-col gap-3'>
                  <div className='text-lg text-white'>
                    {format('profile.organization')}
                  </div>
                  <div className='text-sm text-white'>
                    {user?.own?.organization?.name}
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
