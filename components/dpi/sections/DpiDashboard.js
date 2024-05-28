import { useCallback } from 'react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { FaCircleExclamation } from 'react-icons/fa6'
import { FormattedMessage, useIntl } from 'react-intl'
import { useUser } from '../../../lib/hooks'
import DpiCurricula from '../fragments/DpiCurricula'

const DpiDashboard = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user } = useUser()

  const signOutUser = (e) => {
    e.preventDefault()
    signOut({ callbackUrl: '/dpi-expert-network', redirect: true })
  }

  return (
    <div className='flex flex-col'>
      <img className='h-80 w-full object-cover' alt='DIAL DPI Resource Hub' src='/images/hero-image/dpi-hero.svg' />
      <div className='absolute w-full left-1/2 -translate-x-1/2 min-h-[20rem]' style={{ top: 'var(--ui-header-height)' }}>
        <div className='flex gap-8 justify-center mx-auto'>
          <div className='text-2xl text-center text-white max-w-prose py-20'>
            <FormattedMessage
              id='dpi.dashboard.subtitle'
              values={{
                break: () => <br />
              }}
            />
          </div>
          {user && (
            <Link href='/dpi-member-login' onClick={signOutUser} className='flex self-center'>
              <span className='text-white border-b border-transparent hover:border-white'>
                <FormattedMessage id='dpi.dashboard.signOut' />
              </span>
            </Link>
          )}
        </div>
      </div>
      {!user &&
        <div className='flex items-center min-h-[40vh] 2xl:min-h-[50vh]'>
          <div className='text-dial-stratos text-lg w-full my-auto flex flex-col gap-4'>
            <FaCircleExclamation size='3em' className='mx-auto' />
            <div className='text-center mt-5'>{format('general.unauthorized')}</div>
          </div>
        </div>
      }
      {user &&
        <div className='flex flex-col gap-6 min-h-[30vh]'>
          <DpiCurricula />
        </div>
      }
      <div className='px-4 lg:px-8 min-h-[30vh]'>
        {!user &&
          <div className='flex items-center'>
            <div className='text-dial-stratos text-lg w-full my-auto flex flex-col gap-4'>
              <FaCircleExclamation size='3em' className='mx-auto' />
              <div className='text-center mt-5'>{format('general.unauthorized')}</div>
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default DpiDashboard
