import { useRef } from 'react'
import { useQuery } from '@apollo/client'
import { TASK_TRACKER_DETAIL_QUERY } from '../shared/query/taskTracker'
import Breadcrumb from '../shared/Breadcrumb'
import { Error, Loading, NotFound } from '../shared/FetchStatus'
import TaskTrackerDetailRight from './TaskTrackerDetailRight'
import TaskTrackerDetailLeft from './TaskTrackerDetailLeft'

const TaskTrackerDetail = ({ slug }) => {
  const scrollRef = useRef(null)

  const { loading, error, data } = useQuery(TASK_TRACKER_DETAIL_QUERY, {
    variables: { slug }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.taskTracker) {
    return <NotFound />
  }

  const { taskTracker } = data

  const slugNameMapping = (() => {
    const map = {}
    map[taskTracker.slug] = taskTracker.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-violet text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3'>
          <TaskTrackerDetailLeft scrollRef={scrollRef} taskTracker={taskTracker} />
        </div>
        <div className='lg:basis-2/3'>
          <TaskTrackerDetailRight ref={scrollRef} taskTracker={taskTracker} />
        </div>
      </div>
    </div>
  )
}

export default TaskTrackerDetail
