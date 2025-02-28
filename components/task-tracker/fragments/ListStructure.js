import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { FilterContext } from '../../context/FilterContext'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../shared/GraphQueryHandler'
import { PAGINATED_TASK_TRACKERS_QUERY } from '../../shared/query/taskTracker'
import { DisplayType } from '../../utils/constants'
import TaskTrackerCard from '../TaskTrackerCard'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const { search, showFailedOnly } = useContext(FilterContext)

  const { loading, error, data } = useQuery(PAGINATED_TASK_TRACKERS_QUERY, {
    variables: {
      search,
      showFailedOnly,
      limit: defaultPageSize,
      offset: pageOffset
    },
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
  } else if (!data?.paginatedTaskTrackers) {
    return handleMissingData()
  }

  const { paginatedTaskTrackers: taskTrackers } = data

  return (
    <div className='flex flex-col gap-3'>
      {taskTrackers.map((taskTracker, index) =>
        <div key={index}>
          <TaskTrackerCard
            index={index}
            taskTracker={taskTracker}
            displayType={DisplayType.LARGE_CARD}
          />
        </div>
      )}
    </div>
  )
}

export default ListStructure
