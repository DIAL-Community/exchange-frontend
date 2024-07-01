import { useCallback } from 'react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { FaCircleExclamation } from 'react-icons/fa6'
import { FormattedMessage, useIntl } from 'react-intl'
import { useUser } from '../../../lib/hooks'
import HubAnnouncements from '../fragments/HubAnnouncements'
import HubCurricula from '../fragments/HubCurricula'
import HubEvents from '../fragments/HubEvents'

export const stripeClasses = (stripeIndex) => {
  return stripeIndex % 2 === 0 ? 'text-dial-stratos' : 'text-dial-cotton bg-dial-sapphire'
}

const HubDashboard = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user } = useUser()

  const signOutUser = (e) => {
    e.preventDefault()
    signOut({ callbackUrl: '/hub/expert-network', redirect: true })
  }

  return (
    <div className='flex flex-col'>
      <img className='h-80 w-full object-cover' alt='DIAL DPI Resource Hub' src='/images/hero-image/hub-hero.svg' />
      <div className='absolute w-full left-1/2 -translate-x-1/2 min-h-[20rem]' style={{ top: 'var(--ui-header-height)' }}>
        <div className='flex gap-8 justify-center mx-auto'>
          <div className='text-2xl text-center text-dial-cotton max-w-5xl py-20'>
            <FormattedMessage
              id='dpi.dashboard.subtitle'
              values={{
                break: () => <br />
              }}
            />
          </div>
          {user && (
            <div className='flex flex-col self-center gap-3'>
              <a href='/hub/member-login' onClick={signOutUser}>
                <span className='text-dial-cotton border-b border-transparent hover:border-white'>
                  <FormattedMessage id='dpi.dashboard.signOut' />
                </span>
              </a>
              <Link href='/hub/dashboard/profile'>
                <span className='text-dial-cotton border-b border-transparent hover:border-white'>
                  <FormattedMessage id='dpi.dashboard.profile' />
                </span>
              </Link>
            </div>
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
        <div className='flex flex-col min-h-[30vh]'>
          <HubCurricula stripeIndex={0}/>
          <HubAnnouncements stripeIndex={1}/>
          <HubEvents stripeIndex={2}/>
        </div>
      }
    </div>
  )
}

export default HubDashboard
