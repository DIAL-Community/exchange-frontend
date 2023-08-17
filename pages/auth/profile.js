import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import dynamic from 'next/dynamic'
import Header from '../../ui/v1/shared/Header'
import Footer from '../../ui/v1/shared/Footer'
import { useUser } from '../../lib/hooks'
const Tooltip = dynamic(() => import('react-tooltip').then(x => x.Tooltip), { ssr: false })

const UserProfile = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user } = useUser()

  return (
    <>
      <Header />
      <Tooltip className='tooltip-prose bg-gray-300 text-gray rounded' />
      {user &&
        <div className='flex flex-col lg:flex-row gap-3 xl:pb-8'>
          <div className='relative lg:sticky lg:top-66px w-full lg:w-1/3 xl:w-1/4 h-full py-4 px-4'>
            <div className='bg-white border-2 border-dial-gray shadow-lg'>
              <div className='flex flex-col h-80 p-4'>
                <div className='text-2xl font-semibold absolute line-clamp-1 text-dial-purple'>
                  {user.userName}
                </div>
                <div className='pt-8 m-auto align-middle w-48'>
                  <img
                    className='w-24 m-auto'
                    alt={format('image.alt.logoFor', { name: user.userName })}
                    src='/icons/user.svg'
                  />
                </div>
                <div className='text-sm text-center text-dial-gray-dark'>
                  {format('profile.email')}: {user.userEmail}
                </div>
              </div>
            </div>
          </div>
          <div className='p-4 flex flex-col gap-3 w-full'>
            <div className='text-xl'>
              {format('profile.profile')}
            </div>
            <div className='flex flex-row gap-3'>
              <div className='font-semibold w-1/3 xl:w-1/5'>{format('profile.roles')}:</div>
              <div className=''>{user.roles.join(', ')}</div>
            </div>
            <div className='flex flex-row gap-3'>
              <div className='font-semibold w-1/3 xl:w-1/5'>
                {format('profile.products')}:
              </div>
              <div className=''>{user?.own && user.own.products}</div>
            </div>
            <div className='flex flex-row gap-3'>
              <div className='font-semibold w-1/3 xl:w-1/5'>
                {format('profile.organization')}:
              </div>
              <div>{user?.own && user.own.organization && user.own.organization.name}</div>
            </div>
          </div>
        </div>}
      <Footer />
    </>
  )
}

export default UserProfile
