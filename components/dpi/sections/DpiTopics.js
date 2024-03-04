import DpiTopicTile from '../fragments/DpiTopicTile'
import DpiBreadcrumb from './DpiBreadcrumb'

const DpiTopics = () => {

  return (
    <div className='px-4 lg:px-8 xl:px-56 min-h-[70vh] py-8'>
      <div className='flex flex-col gap-6'>
        <DpiBreadcrumb />
        <DpiTopicTile />
      </div>
    </div>
  )
}

export default DpiTopics
