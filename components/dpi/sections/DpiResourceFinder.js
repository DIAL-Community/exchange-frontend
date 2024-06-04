import { FormattedMessage } from 'react-intl'
import DpiResources from './DpiResources'

const DpiResourceFinder = () => {
  return (
    <>
      <img className='h-80 w-full object-cover' alt='DIAL DPI Resource Hub' src='/images/hero-image/dpi-hero.svg'/>
      <div className='absolute w-full left-1/2 -translate-x-1/2 min-h-[20rem]' style={{ top: 'var(--ui-header-height)' }}>
        <div className='text-2xl text-center text-dial-cotton pt-20 pb-10 uppercase mx-auto max-w-prose'>
          <FormattedMessage
            id='dpi.resourceFinder.title'
            values={{
              break: () => <br />
            }}
          />
        </div>
        <div className='text-lg text-center text-dial-cotton mx-auto max-w-prose'>
          <FormattedMessage
            id='dpi.resourceFinder.subtitle'
            values={{
              break: () => <br />
            }}
          />
        </div>
      </div>
      <DpiResources />
    </>
  )
}

export default DpiResourceFinder
