import { FormattedMessage } from 'react-intl'
import HubCountryTile from '../fragments/HubCountryTile'

const HubCountries = () => {

  return (
    <div className='flex flex-col gap-6 pb-12'>
      <img className='h-32 xl:h-80 w-full object-cover' alt='DIAL DPI Resource Hub' src='/images/hero-image/hub-hero.svg' />
      <div className='absolute w-full left-1/2 -translate-x-1/2 min-h-[20rem]' style={{ top: 'var(--ui-header-height)' }}>
        <div className='flex flex-col gap-8 justify-center mx-auto py-12 px-4 xl:flex-row xl:py-20'>
          <div className='md:text-xl 2xl:text-2xl text-center text-dial-cotton lg:max-w-prose line-clamp-6'>
            <FormattedMessage
              id='dpi.country.subtitle'
              values={{
                break: () => <br />
              }}
            />
          </div>
        </div>
      </div>
      <div className='px-4 lg:px-8 xl:px-56  min-h-[40vh] 2xl:min-h-[50vh]'>
        <div className='flex flex-col gap-6'>
          <HubCountryTile />
        </div>
      </div>
    </div>
  )
}

export default HubCountries
