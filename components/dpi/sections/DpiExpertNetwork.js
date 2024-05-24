import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { FormattedMessage } from 'react-intl'
import { useUser } from '../../../lib/hooks'

const DpiExpertNetwork = () => {
  const { user } = useUser()

  const signInUser = (e) => {
    e.preventDefault()
    signIn()
  }

  return (
    <div className='flex flex-col gap-6 pb-12 max-w-catalog'>
      <img className='h-80 w-full object-cover' alt='DIAL DPI Resource Hub' src='/images/hero-image/dpi-hero.svg' />
      <div className='absolute w-full left-1/2 -translate-x-1/2 min-h-[20rem]' style={{ top: 'var(--ui-header-height)' }}>
        <div className='flex gap-8 justify-center mx-auto py-20'>
          <div className='text-2xl text-center text-white  max-w-prose'>
            <FormattedMessage
              id='dpi.expertNetwork.subtitle'
              values={{
                break: () => <br />
              }}
            />
          </div>
          <div className='flex flex-col gap-4'>
            <a
              target='_blank'
              rel='noreferrer'
              href='//https://dial.global/work/adli/'
              className='text-white border-b border-transparent hover:border-white'
            >
              <FormattedMessage id='dpi.exportNetwork.learnMore' />
            </a>
            {user && (
              <Link href='/dpi-dashboard' className='flex'>
                <span className='text-white border-b border-transparent hover:border-white'>
                  <FormattedMessage id='dpi.exportNetwork.memberDashboard' />
                </span>
              </Link>
            )}
            {!user && (
              <Link href='/dpi-member-login' onClick={signInUser} className='flex'>
                <span className='text-white border-b border-transparent hover:border-white'>
                  <FormattedMessage id='dpi.exportNetwork.login' />
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className='px-4 lg:px-8 xl:px-56  min-h-[40vh] 2xl:min-h-[50vh]'>
        <div className='flex flex-col gap-6'>
          ADLI Members
        </div>
      </div>
    </div>
  )
}

export default DpiExpertNetwork
