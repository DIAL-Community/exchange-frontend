import { useRef } from 'react'
import { useApolloClient, useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import Breadcrumb from '../shared/Breadcrumb'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../shared/GraphQueryHandler'
import { WORKFLOW_DETAIL_QUERY, WORKFLOW_POLICY_QUERY } from '../shared/query/workflow'
import { fetchOperationPolicies } from '../utils/policy'
import WorkflowDetailLeft from './WorkflowDetailLeft'
import WorkflowDetailRight from './WorkflowDetailRight'

const WorkflowDetail = ({ slug }) => {
  const scrollRef = useRef(null)
  const client = useApolloClient()

  const policies = fetchOperationPolicies(
    client,
    WORKFLOW_POLICY_QUERY,
    ['editing', 'deleting']
  )

  const editingAllowed = policies['editing']
  const deletingAllowed = policies['deleting']

  const { loading, error, data } = useQuery(WORKFLOW_DETAIL_QUERY, {
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
  } else if (!data?.workflow) {
    return handleMissingData()
  }

  const { workflow } = data

  const slugNameMapping = (() => {
    const map = {}
    map[workflow.slug] = workflow.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-violet text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3'>
          <WorkflowDetailLeft scrollRef={scrollRef} workflow={workflow} />
        </div>
        <div className='lg:basis-2/3'>
          <WorkflowDetailRight
            ref={scrollRef}
            workflow={workflow}
            editingAllowed={editingAllowed}
            deletingAllowed={deletingAllowed}
          />
        </div>
      </div>
    </div>
  )
}

export default WorkflowDetail
