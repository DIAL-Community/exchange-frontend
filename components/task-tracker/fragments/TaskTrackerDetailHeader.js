const TaskTrackerDetailHeader = ({ taskTracker }) => {

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      <div className='text-xl text-dial-plum font-semibold'>
        {taskTracker.name}
      </div>
    </div>
  )
}

export default TaskTrackerDetailHeader
