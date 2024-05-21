import { FormattedMessage } from 'react-intl'

const DpiDashboard = () => {
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
      <div className='px-4 lg:px-8 xl:px-96 min-h-[40vh] 2xl:min-h-[50vh]'>
        <div className="grid grid-cols-2 gap-3">
          <div className='bg-dial-deep-purple text-white py-8 aspect-square relative flex justify-center'>
            Curriculum
          </div>
          <div className='bg-dial-deep-purple text-white py-8 aspect-square relative flex justify-center'>
            Announcements
          </div>
          <div className='bg-dial-deep-purple text-white py-8 aspect-square relative flex justify-center'>
            Linkedin Group
          </div>
          <div className='bg-dial-deep-purple text-white py-8 aspect-square relative flex justify-center'>
            Upcoming events
          </div>
        </div>
      </div>
    </div>
  )
}

export default DpiDashboard
