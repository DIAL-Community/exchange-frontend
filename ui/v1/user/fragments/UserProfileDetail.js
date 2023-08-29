import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { signOut } from 'next-auth/react'
import { useUser } from '../../../../lib/hooks'

const UserProfileDetail = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user } =  useUser()

  return (
    <div className='grid lg:grid-cols-6 gap-8 px-8 py-8'>
      <div className='flex mb-auto mx-auto'>
        <img
          src='/ui/v1/user-header.svg'
          alt={format('ui.image.logoAlt', { name: format('ui.profile.label') })}
          width={64}
          height={64}
          className='object-contain object-center'
        />
      </div>
      <div className='lg:col-span-5'>
        <div className='flex flex-col'>
          <div className='grid lg:grid-cols-2'>
            <div className='flex flex-col gap-8'>
              <div className='flex flex-col gap-3'>
                <div className='text-lg text-dial-sapphire'>
                  {format('profile.username')}
                </div>
                <div className='text-sm text-dial-stratos'>
                  {user?.userName}
                </div>
              </div>
              <div className='flex flex-col gap-3'>
                <div className='text-lg text-dial-sapphire'>
                  {format('profile.email')}
                </div>
                <div className='text-sm text-dial-stratos'>
                  {user?.userEmail}
                </div>
              </div>
            </div>
            <div className='flex flex-col gap-8'>
              <div className='flex flex-col gap-3'>
                <div className='text-lg text-dial-sapphire'>
                  {format('profile.roles')}
                </div>
                <div className='text-sm text-dial-stratos'>
                  {user?.roles.join(', ')}
                </div>
              </div>
              <div className='flex flex-col gap-3'>
                <div className='text-lg text-dial-sapphire'>
                  {format('profile.organization')}
                </div>
                <div className='text-sm text-dial-stratos'>
                  {user?.own?.organization?.name}
                </div>
              </div>
            </div>
          </div>
          <hr className='border-b border-slate-200 my-6'/>
          <div className='grid grid-cols-2'>
            <div className='flex flex-col gap-3'>
              <div className='text-lg text-dial-sapphire'>
                {format('app.changePassword')}
              </div>
              <div className='text-sm text-dial-stratos'>
                <a
                  href='#'
                  onClick={signOut}
                  className='border-b border-dial-iris-blue'
                >
                  {format('app.changePassword')}
                </a>
              </div>
            </div>
          </div>
          <hr className='border-b border-slate-200 my-6'/>
          <div className='grid grid-cols-2'>
            <div className='flex flex-col gap-8'>
              <div className='flex flex-col gap-3'>
                <div className='text-lg text-dial-sapphire'>
                  {format('header.signOut')}
                </div>
                <div className='text-sm text-dial-stratos'>
                  <a
                    href='#'
                    onClick={signOut}
                    className='border-b border-dial-iris-blue'
                  >
                    {format('header.signOut')}
                  </a>
                </div>
              </div>
            </div>
            <div className='flex flex-col gap-8'>
              <div className='flex flex-col gap-3'>
                <div className='text-lg text-dial-sapphire'>
                  {format('app.deleteAccount')}
                </div>
                <div className='text-sm text-dial-stratos'>
                  <a
                    href='#'
                    onClick={signOut}
                    className='border-b border-dial-iris-blue'
                  >
                    {format('app.deleteAccount')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfileDetail
