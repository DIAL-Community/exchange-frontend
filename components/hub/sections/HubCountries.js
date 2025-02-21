import { FormattedMessage } from 'react-intl'
import HubCountryTile from '../fragments/HubCountryTile'

const HubCountries = () => {

  return (
    <div className='flex flex-col gap-6 pb-12 max-w-catalog mx-auto'>
      <img
        className='h-32 w-full object-cover'
        alt='DIAL Resource Hub - Country Profiles'
        src='/images/hero-image/hub-countries.svg'
      />
      <div className='absolute w-full left-1/2 -translate-x-1/2' style={{ top: 'var(--ui-header-height)' }}>
        <div className='max-w-catalog mx-auto py-12'>
          <div className='text-2xl px-4 lg:px-8 xl:px-24 3xl:px-56 text-dial-gray'>
            Country Profiles
          </div>
        </div>
      </div>
      <div className='px-4 lg:px-8 xl:px-24 3xl:px-56 min-h-[60vh] lg:min-h-[65vh]'>
        <div className='flex flex-col gap-6'>
          <div className='max-w-4xl'>
            <FormattedMessage id='hub.country.subtitle' />
          </div>
          <HubCountryTile />
        </div>
      </div>
    </div>
  )
}

export default HubCountries
