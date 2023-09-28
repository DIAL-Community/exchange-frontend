import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { PAGINATED_TASK_TRACKERS_QUERY } from '../../shared/query/taskTracker'
import TaskTrackerCard from '../TaskTrackerCard'
import { DisplayType } from '../../utils/constants'
import { FilterContext } from '../../context/FilterContext'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const { search } = useContext(FilterContext)

  const { loading, error, data } = useQuery(PAGINATED_TASK_TRACKERS_QUERY, {
    variables: {
      search,
      limit: defaultPageSize,
      offset: pageOffset
    }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.paginatedTaskTrackers) {
    return <NotFound />
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
