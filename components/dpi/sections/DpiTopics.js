import { FormattedMessage } from 'react-intl'
import DpiTopicTile from '../fragments/DpiTopicTile'
import DpiBreadcrumb from './DpiBreadcrumb'

const DpiTopics = () => {

  return (
    <div className='flex flex-col gap-6 pb-12'>
      <div className='bg-dial-teal px-4 lg:px-8 xl:px-56 pt-6 min-h-[20rem]'>
        <DpiBreadcrumb />
        <div className='text-2xl text-center text-white py-8 mx-auto max-w-prose'>
          <FormattedMessage
            id='dpi.topic.subtitle'
            values={{
              break: () => <br />
            }}
          />
        </div>
      </div>
      <div className='-mt-[10rem]'>
        <DpiTopicTile />
      </div>
    </div>
  )
}

export default DpiTopics
