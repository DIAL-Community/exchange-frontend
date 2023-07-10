import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { signOut } from 'next-auth/react'
import { useUser } from '../../../../lib/hooks'

const UserProfileDetail = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user } =  useUser()
  console.log(user)

  return (
    <div className='grid grid-cols-6 gap-8 px-8 py-8'>
      <div className='flex mb-auto mx-auto'>
        <img
          src='/ui/v1/user-header.svg'
          alt={format('ui.image.logoAlt', { name: format('ui.profile.label') })}
          width={64}
          height={64}
          className='object-contain object-center'
        />
      </div>
      <div className='col-span-5'>
        <div className='flex flex-col'>
          <div className='grid grid-cols-2'>
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
                  {user?.own?.organization.name}
                </div>
              </div>
            </div>
          </div>
          <hr className='bg-slate-200 my-6'/>
          <div className='grid grid-cols-2'>
            <div className='flex flex-col gap-3'>
              <div className='text-lg text-dial-sapphire'>
                Change Password
              </div>
              <div className='text-sm text-dial-stratos'>
                <button
                  onClick={signOut}
                  className='border-b border-transparent hover:border-dial-iris-blue'
                >
                  Change password
                </button>
              </div>
            </div>
          </div>
          <hr className='bg-slate-200 my-6'/>
          <div className='grid grid-cols-2'>
            <div className='flex flex-col gap-8'>
              <div className='flex flex-col gap-3'>
                <div className='text-lg text-dial-sapphire'>
                  {format('header.signOut')}
                </div>
                <div className='text-sm text-dial-stratos'>
                  <button
                    onClick={signOut}
                    className='border-b border-transparent hover:border-dial-iris-blue'
                  >
                    {format('header.signOut')}
                  </button>
                </div>
              </div>
            </div>
            <div className='flex flex-col gap-8'>
              <div className='flex flex-col gap-3'>
                <div className='text-lg text-dial-sapphire'>
                  Delete Account
                </div>
                <div className='text-sm text-dial-stratos'>
                  <button
                    onClick={signOut}
                    className='border-b border-transparent hover:border-dial-iris-blue'
                  >
                    Delete account
                  </button>
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
