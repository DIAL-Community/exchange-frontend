import { FormattedMessage } from 'react-intl'
import DpiCountryTile from '../fragments/DpiCountryTile '

const DpiCountries = () => {

  return (
    <div className='flex flex-col gap-6 pb-12'>
      <img className='h-64 w-full object-cover' alt='DIAL DPI Resource Hub' src='/images/hero-image/dpi-hero.svg' />
      <div className='absolute w-full top-28 left-1/2 -translate-x-1/2 px-4 lg:px-8 pt-6 min-h-[20rem]'>
        <div className='text-2xl text-center text-white py-8 mx-auto max-w-prose'>
          <FormattedMessage
            id='dpi.country.subtitle'
            values={{
              break: () => <br />
            }}
          />
        </div>
      </div>
      <div className='px-4 lg:px-8 xl:px-56  min-h-[40vh] 2xl:min-h-[50vh]'>
        <div className='flex flex-col gap-6'>
          <DpiCountryTile />
        </div>
      </div>
    </div>
  )
}

export default DpiCountries
