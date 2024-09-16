import { useQuery } from '@apollo/client'
import { useContext } from 'react'
import { FilterContext } from '../../context/FilterContext'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { PAGINATED_WORKFLOWS_QUERY } from '../../shared/query/workflow'
import { DisplayType } from '../../utils/constants'
import WorkflowCard from '../WorkflowCard'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const { search, sdgs, useCases } = useContext(FilterContext)

  const { loading, error, data } = useQuery(PAGINATED_WORKFLOWS_QUERY, {
    variables: {
      search,
      sdgs: sdgs.map(sdg => sdg.value),
      useCases: useCases.map(sdg => sdg.value),
      limit: defaultPageSize,
      offset: pageOffset
    }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.paginatedWorkflows) {
    return <NotFound />
  }

  const { paginatedWorkflows: workflows } = data

  return (
    <div className='flex flex-col gap-3'>
      {workflows.map((workflow, index) =>
        <div key={index}>
          <WorkflowCard
            index={index}
            workflow={workflow}
            displayType={DisplayType.LARGE_CARD}
          />
        </div>
      )}
    </div>
  )
}

export default ListStructure
