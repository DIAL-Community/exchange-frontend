import { FormattedMessage } from 'react-intl'
import HubTopicTile from '../fragments/HubTopicTile'

const HubTopics = () => {

  return (
    <div className='flex flex-col gap-6 pb-12'>
      <img className='h-80 w-full object-cover' alt='DIAL DPI Resource Hub' src='/images/hero-image/hub-hero.svg' />
      <div className='absolute w-full left-1/2 -translate-x-1/2 min-h-[20rem]' style={{ top: 'var(--ui-header-height)' }}>
        <div className='text-2xl text-center text-dial-cotton py-6 md:py-12 lg:py-16 xl:py-16 mx-auto max-w-prose'>
          <FormattedMessage
            id='dpi.topic.subtitle'
            values={{
              break: () => <br />
            }}
          />
        </div>
      </div>
      <div className='px-4 lg:px-8 xl:px-56 min-h-[40vh] 2xl:min-h-[50vh]'>
        <div className='-mt-[8rem] z-20'>
          <HubTopicTile />
        </div>
      </div>
    </div>
  )
}

export default HubTopics
