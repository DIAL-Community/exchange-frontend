import TaskTrackerMainLeft from './TaskTrackerMainLeft'
import TaskTrackerMainRight from './TaskTrackerMainRight'

const TaskTrackerMain = ({ activeTab }) => {
  return (
    <div className='px-4 lg:px-8 xl:px-56'>
      <div className='grid grid-cols-3 gap-x-8'>
        <div className='hidden md:block col-span-1'>
          <TaskTrackerMainLeft activeTab={activeTab} />
        </div>
        <div className='col-span-3 md:col-span-2'>
          <TaskTrackerMainRight activeTab={activeTab} />
        </div>
      </div>
    </div>
  )
}

export default TaskTrackerMain
