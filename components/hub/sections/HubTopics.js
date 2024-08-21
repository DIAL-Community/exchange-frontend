import { FormattedMessage } from 'react-intl'
import HubTopicTile from '../fragments/HubTopicTile'

const HubTopics = () => {

  return (
    <div className='flex flex-col gap-6 pb-12'>
      <img className='h-80 w-full object-cover' alt='DIAL DPI Resource Hub' src='/images/hero-image/hub-hero.svg' />
      <div className='absolute w-full left-1/2 -translate-x-1/2 min-h-[20rem]' style={{ top: 'var(--ui-header-height)' }}>
        <div className='flex flex-col gap-8 items-center justify-items-center mx-auto py-12 px-4 xl:py-20'>
          <div className='md:text-xl 2xl:text-2xl text-center text-dial-cotton max-w-prose'>
            <FormattedMessage
              id='hub.topic.subtitle'
              values={{
                break: () => <br />
              }}
            />
          </div>
        </div>
      </div>
      <div className='px-24 md:px-36 lg:px-56 min-h-[55vh]'>
        <div className='-mt-[8rem] z-20'>
          <HubTopicTile />
        </div>
      </div>
    </div>
  )
}

export default HubTopics
