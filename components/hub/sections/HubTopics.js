import { FormattedMessage } from 'react-intl'
import HubTopicTile from '../fragments/HubTopicTile'

const HubTopics = () => {

  return (
    <div className='flex flex-col gap-6 pb-12 max-w-catalog'>
      <img className='h-32 w-full object-cover' alt='DIAL Resource Hub' src='/images/hero-image/hub-hero.svg' />
      <div className='absolute w-full left-1/2 -translate-x-1/2' style={{ top: 'var(--ui-header-height)' }}>
        <div className='max-w-catalog mx-auto py-12'>
          <div className='text-2xl px-4 lg:px-8 xl:px-56 text-dial-gray'>
            Browse Resources by Topic
          </div>
        </div>
      </div>
      <div className='px-4 lg:px-8 xl:px-56 min-h-[60vh] lg:min-h-[65vh]'>
        <div className='flex flex-col gap-6 z-20'>
          <div className='max-w-4xl'>
            <FormattedMessage id='hub.topic.subtitle' />
          </div>
          <HubTopicTile />
        </div>
      </div>
    </div>
  )
}

export default HubTopics
