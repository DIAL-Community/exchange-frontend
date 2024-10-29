import { useRef, useState } from 'react'
import { useApolloClient, useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import Breadcrumb from '../../shared/Breadcrumb'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../shared/GraphQueryHandler'
import { USE_CASE_POLICY_QUERY } from '../../shared/query/useCase'
import { USE_CASE_STEP_QUERY } from '../../shared/query/useCaseStep'
import { fetchOperationPolicies } from '../../utils/policy'
import UseCaseStepDetailLeft from './UseCaseStepDetailLeft'
import UseCaseStepDetailRight from './UseCaseStepDetailRight'

const UseCaseStepDetail = ({ slug, stepSlug }) => {
  const scrollRef = useRef(null)
  const client = useApolloClient()

  const [editingAllowed, setEditingAllowed] = useState(false)

  const { loading, error, data } = useQuery(USE_CASE_STEP_QUERY, {
    variables: { slug, stepSlug },
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
  } else if (!data?.useCase) {
    return handleMissingData()
  }

  const { useCase, useCaseStep } = data

  fetchOperationPolicies(
    client,
    USE_CASE_POLICY_QUERY,
    ['editing', 'deleting']
  ).then(policies => {
    setEditingAllowed(policies['editing'])
  })

  const slugNameMapping = (() => {
    const map = {}
    map[useCase.slug] = useCase.name
    map[useCaseStep.slug] = useCaseStep.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-blue-chalk text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3'>
          <UseCaseStepDetailLeft
            scrollRef={scrollRef}
            useCase={useCase}
            useCaseStep={useCaseStep}
          />
        </div>
        <div className='lg:basis-2/3'>
          <UseCaseStepDetailRight
            ref={scrollRef}
            useCase={useCase}
            useCaseStep={useCaseStep}
            editingAllowed={editingAllowed}
          />
        </div>
      </div>
    </div>
  )
}

export default UseCaseStepDetail
