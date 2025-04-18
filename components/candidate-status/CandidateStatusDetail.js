import { useRef, useState } from 'react'
import { useApolloClient, useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import Breadcrumb from '../shared/Breadcrumb'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../shared/GraphQueryHandler'
import { CANDIDATE_STATUS_DETAIL_QUERY, CANDIDATE_STATUS_POLICY_QUERY } from '../shared/query/candidateStatus'
import { fetchOperationPolicies } from '../utils/policy'
import CandidateStatusDetailLeft from './CandidateStatusDetailLeft'
import CandidateStatusDetailRight from './CandidateStatusDetailRight'

const CandidateStatusDetail = ({ slug }) => {
  const scrollRef = useRef(null)
  const client = useApolloClient()

  const [editingAllowed, setEditingAllowed] = useState(false)
  const [deletingAllowed, setDeletingAllowed] = useState(false)

  const { loading, error, data } = useQuery(CANDIDATE_STATUS_DETAIL_QUERY, {
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
  } else if (!data?.candidateStatus) {
    return handleMissingData()
  }

  fetchOperationPolicies(
    client,
    CANDIDATE_STATUS_POLICY_QUERY,
    ['editing', 'deleting']
  ).then(policies => {
    setEditingAllowed(policies['editing'])
    setDeletingAllowed(policies['deleting'])
  })

  const { candidateStatus } = data

  const slugNameMapping = () => {
    const map = {}
    map[candidateStatus.slug] = candidateStatus.name

    return map
  }

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-violet text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping()}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3 shrink-0'>
          <CandidateStatusDetailLeft scrollRef={scrollRef} candidateStatus={candidateStatus} />
        </div>
        <div className='lg:basis-2/3'>
          <CandidateStatusDetailRight
            ref={scrollRef}
            candidateStatus={candidateStatus}
            editingAllowed={editingAllowed}
            deletingAllowed={deletingAllowed}
          />
        </div>
      </div>
    </div>
  )
}

export default CandidateStatusDetail
