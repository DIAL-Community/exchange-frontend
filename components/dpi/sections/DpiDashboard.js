import { useCallback } from 'react'
import Link from 'next/link'
import { FaCircleExclamation } from 'react-icons/fa6'
import { FormattedMessage, useIntl } from 'react-intl'
import { useUser } from '../../../lib/hooks'

const DpiDashboard = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user } = useUser()

  return (
    <div className='flex flex-col gap-6 pb-12'>
      <img className='h-80 w-full object-cover' alt='DIAL DPI Resource Hub' src='/images/hero-image/dpi-hero.svg' />
      <div className='absolute w-full left-1/2 -translate-x-1/2 min-h-[20rem]' style={{ top: 'var(--ui-header-height)' }}>
        <div className='text-2xl text-center text-white py-6 md:py-12 lg:py-16 xl:py-16 mx-auto max-w-prose'>
          <FormattedMessage
            id='dpi.dashboard.subtitle'
            values={{
              break: () => <br />
            }}
          />
        </div>
      </div>
      <div className='px-4 lg:px-8 min-h-[40vh] 2xl:min-h-[50vh]'>
        {!user &&
          <div className='flex items-center'>
            <div className='text-dial-stratos text-lg w-full my-auto flex flex-col gap-4'>
              <FaCircleExclamation size='3em' className='mx-auto' />
              <div className='text-center mt-5'>{format('general.unauthorized')}</div>
            </div>
          </div>
        }
        {user &&
          <div className="grid grid-cols-2 gap-8 mx-auto max-w-4xl">
            <div className='border border-dial-deep-purple py-8 aspect-video'>
              <div className='flex justify-center'>
                <Link href='/dpi-curriculum'>
                  Curriculum
                </Link>
              </div>
            </div>
            <div className='border border-dial-deep-purple py-8 aspect-video'>
              <div className='flex justify-center'>
                Announcements
              </div>
            </div>
            <div className='border border-dial-deep-purple py-8 aspect-video'>
              <div className='flex justify-center'>
                Linkedin Group
              </div>
            </div>
            <div className='border border-dial-deep-purple py-8 aspect-video'>
              <div className='flex justify-center'>
                Upcoming events
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default DpiDashboard
