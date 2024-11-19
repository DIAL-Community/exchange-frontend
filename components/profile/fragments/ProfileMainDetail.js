import { useCallback, useContext, useState } from 'react'
import { signOut } from 'next-auth/react'
import { useIntl } from 'react-intl'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'

const ProfileMainDetail = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [preparingPasswordUpdate, setPreparingPasswordUpdate] = useState(false)

  const { user } =  useUser()
  const { showToast } = useContext(ToastContext)

  const requestPasswordChange = async (event) => {
    event.preventDefault()
    if (preparingPasswordUpdate) {
      return false
    }

    setPreparingPasswordUpdate(true)

    const { userEmail } = user
    const response = await fetch(process.env.NEXT_PUBLIC_AUTH_SERVER + '/authentication/reset-password', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_AUTH_SERVER,
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': 'Set-Cookie',
        'X-User-Email': userEmail
      }
    })

    setPreparingPasswordUpdate(false)
    if (response.status === 201) {
      showToast(format('reset.created'), 'success', 'top-center', 3000)
    }
  }

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
                  onClick={requestPasswordChange}
                  className='border-b border-dial-iris-blue'
                >
                  {format('app.changePassword')}
                </a>
              </div>
            </div>
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileMainDetail
