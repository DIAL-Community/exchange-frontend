import { FormattedMessage } from 'react-intl'
import DpiResourceFinder from './DpiResourceFinder'

const DpiResources = () => {
  return (
    <>
      <img className='h-64 w-full object-cover' alt='DIAL DPI Resource Hub' src='/images/hero-image/dpi-hero.svg'/>
      <div className='absolute w-full top-28 left-1/2 -translate-x-1/2 px-4 lg:px-8 xl:px-56 pt-6 min-h-[20rem]'>
        <div className='text-2xl text-center text-white py-5 uppercase mx-auto max-w-prose'>
          <FormattedMessage
            id='dpi.resourcefinder.title'
            values={{
              break: () => <br />
            }}
          />
        </div>
        <div className='text-lg text-center text-white pb-8 mx-auto max-w-prose'>
          <FormattedMessage
            id='dpi.resourcefinder.subtitle'
            values={{
              break: () => <br />
            }}
          />
        </div>
      </div>
      <DpiResourceFinder />
    </>
  )
}

export default DpiResources
