import { useRef, useState } from 'react'
import { useApolloClient, useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import Breadcrumb from '../shared/Breadcrumb'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../shared/GraphQueryHandler'
import { TASK_TRACKER_DETAIL_QUERY, TASK_TRACKER_POLICY_QUERY } from '../shared/query/taskTracker'
import { fetchOperationPolicies } from '../utils/policy'
import TaskTrackerDetailLeft from './TaskTrackerDetailLeft'
import TaskTrackerDetailRight from './TaskTrackerDetailRight'

const TaskTrackerDetail = ({ slug }) => {
  const scrollRef = useRef(null)
  const client = useApolloClient()

  const [editingAllowed, setEditingAllowed] = useState(false)
  const [deletingAllowed, setDeletingAllowed] = useState(false)

  const { loading, error, data } = useQuery(TASK_TRACKER_DETAIL_QUERY, {
    variables: { slug },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  if (loading) {
    return handleLoadingQuery()
  } else if (error) {
    return handleQueryError(error)
  } else if (!data?.taskTracker) {
    return handleMissingData()
  }

  fetchOperationPolicies(
    client,
    TASK_TRACKER_POLICY_QUERY,
    ['editing', 'deleting']
  ).then(policies => {
    setEditingAllowed(policies['editing'])
    setDeletingAllowed(policies['deleting'])
  })

  const { taskTracker } = data

  const slugNameMapping = () => {
    const map = {}
    map[taskTracker.slug] = taskTracker.name

    return map
  }

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-violet text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping()}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3 shrink-0'>
          <TaskTrackerDetailLeft scrollRef={scrollRef} taskTracker={taskTracker} />
        </div>
        <div className='lg:basis-2/3'>
          <TaskTrackerDetailRight
            ref={scrollRef}
            taskTracker={taskTracker}
            editingAllowed={editingAllowed}
            deletingAllowed={deletingAllowed}
          />
        </div>
      </div>
    </div>
  )
}

export default TaskTrackerDetail
