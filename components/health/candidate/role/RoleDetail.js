import { useRef } from 'react'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../../lib/apolloClient'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../../shared/GraphQueryHandler'
import { CANDIDATE_ROLE_DETAIL_QUERY } from '../../../shared/query/candidateRole'
import Breadcrumb from '../../shared/Breadcrumb'
import RoleDetailLeft from './fragments/RoleDetailLeft'
import RoleDetailRight from './fragments/RoleDetailRight'

const RoleDetail = ({ id }) => {
  const scrollRef = useRef(null)

  const { loading, error, data } = useQuery(CANDIDATE_ROLE_DETAIL_QUERY, {
    variables: { id },
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
        <Breadcrumb slugNameMapping={slugNameMapping}/>
        <hr className="border-b border-health-gray my-3"/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3'>
          <RoleDetailLeft scrollRef={scrollRef} role={role}/>
        </div>
        <div className='lg:basis-2/3'>
          <RoleDetailRight ref={scrollRef} role={role}/>
        </div>
      </div>
    </div>
  )
}

export default RoleDetail
