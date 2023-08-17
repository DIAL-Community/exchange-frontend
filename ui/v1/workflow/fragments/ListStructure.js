import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { Error, Loading } from '../../../../components/shared/FetchStatus'
import { PAGINATED_WORKFLOWS_QUERY } from '../../shared/query/workflow'
import { WorkflowFilterContext } from '../../../../components/context/WorkflowFilterContext'
import WorkflowCard from '../WorkflowCard'
import { DisplayType } from '../../utils/constants'
import { NotFound } from '../../shared/FetchStatus'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const { search } = useContext(WorkflowFilterContext)
  const { sdgs, useCases } = useContext(WorkflowFilterContext)

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
