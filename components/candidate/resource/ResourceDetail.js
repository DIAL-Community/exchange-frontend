import { useRef, useState } from 'react'
import { useApolloClient, useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import Breadcrumb from '../../shared/Breadcrumb'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../shared/GraphQueryHandler'
import { CANDIDATE_RESOURCE_DETAIL_QUERY, CANDIDATE_RESOURCE_POLICY_QUERY } from '../../shared/query/candidateResource'
import { fetchOperationPolicies } from '../../utils/policy'
import ResourceDetailLeft from './ResourceDetailLeft'
import ResourceDetailRight from './ResourceDetailRight'

const ResourceDetail = ({ slug }) => {
  const scrollRef = useRef(null)
  const client = useApolloClient()

  const [editingAllowed, setEditingAllowed] = useState(false)

  const { loading, error, data } = useQuery(CANDIDATE_RESOURCE_DETAIL_QUERY, {
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
  } else if (!data?.candidateResource) {
    return handleMissingData()
  }

  const { candidateResource } = data

  fetchOperationPolicies(
    client,
    CANDIDATE_RESOURCE_POLICY_QUERY,
    ['editing']
  ).then(policies => {
    setEditingAllowed(policies['editing'])
  })

  const slugNameMapping = (() => {
    const map = {}
    map[candidateResource.slug] = candidateResource.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-spearmint text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3 shrink-0'>
          <ResourceDetailLeft candidateResource={candidateResource} scrollRef={scrollRef} />
        </div>
        <div className='lg:basis-2/3 shrink-0'>
          <ResourceDetailRight
            ref={scrollRef}
            candidateResource={candidateResource}
            editingAllowed={editingAllowed}
          />
        </div>
      </div>
    </div>
  )
}

export default ResourceDetail
