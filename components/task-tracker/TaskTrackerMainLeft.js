import TaskTrackerListLeft from './fragments/TaskTrackerListLeft'
import TaskTrackerSimpleLeft from './fragments/TaskTrackerSimpleLeft'

const TaskTrackerMainLeft = ({ activeTab }) => {

  return (
    <>
      { activeTab === 0 && <TaskTrackerListLeft /> }
      { activeTab === 1 && <TaskTrackerSimpleLeft />}
      { activeTab === 2 && <TaskTrackerSimpleLeft /> }
    </>
  )
}

export default TaskTrackerMainLeft
