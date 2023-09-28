import TaskTrackerDefinition from './fragments/TaskTrackerDefinition'
import TaskTrackerListRight from './fragments/TaskTrackerListRight'
import TaskTrackerForm from './fragments/TaskTrackerForm'

const TaskTrackerMainRight = ({ activeTab }) => {
  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && <TaskTrackerListRight /> }
      { activeTab === 1 && <TaskTrackerDefinition /> }
      { activeTab === 2 && <TaskTrackerForm /> }
    </div>
  )
}

export default TaskTrackerMainRight
