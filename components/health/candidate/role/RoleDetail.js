import { useEffect, useRef, useState } from 'react'
import { useApolloClient, useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../../lib/apolloClient'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../../shared/GraphQueryHandler'
import { CANDIDATE_ROLE_DETAIL_QUERY, CANDIDATE_ROLE_POLICY_QUERY } from '../../../shared/query/candidateRole'
import { fetchOperationPolicies } from '../../../utils/policy'
import Breadcrumb from '../../shared/Breadcrumb'
import RoleDetailLeft from './fragments/RoleDetailLeft'
import RoleDetailRight from './fragments/RoleDetailRight'

const RoleDetail = ({ id }) => {
  const scrollRef = useRef(null)
  const client = useApolloClient()

  const [editingAllowed, setEditingAllowed] = useState(false)

  const { loading, error, data } = useQuery(CANDIDATE_ROLE_DETAIL_QUERY, {
    variables: { id },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  useEffect(() => {
    fetchOperationPolicies(
      client,
      CANDIDATE_ROLE_POLICY_QUERY,
      ['editing']
    ).then(policies => {
      setEditingAllowed(policies['editing'])
    })
  }, [client])

  if (loading) {
    return handleLoadingQuery()
  } else if (error) {
    return handleQueryError(error)
  } else if (!data?.candidateRole) {
    return handleMissingData()
  }

  const { candidateRole: role } = data

  const slugNameMapping = (() => {
    const map = {}
    map[role.id] = role.email

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className="py-6 text-dial-stratos z-40">
        <Breadcrumb slugNameMapping={slugNameMapping} />
        <hr className="border-b border-health-gray my-3" />
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3 shrink-0'>
          <RoleDetailLeft scrollRef={scrollRef} role={role} />
        </div>
        <div className='lg:basis-2/3 shrink-0'>
          <RoleDetailRight
            ref={scrollRef}
            role={role}
            editingAllowed={editingAllowed}
          />
        </div>
      </div>
    </div>
  )
}

export default RoleDetail
