import { useRef } from 'react'
import { useApolloClient, useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import Breadcrumb from '../shared/Breadcrumb'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../shared/GraphQueryHandler'
import { ORGANIZATION_DETAIL_QUERY, ORGANIZATION_POLICY_QUERY } from '../shared/query/organization'
import { fetchOperationPolicies } from '../utils/policy'
import OrganizationDetailLeft from './OrganizationDetailLeft'
import OrganizationDetailRight from './OrganizationDetailRight'

const OrganizationDetail = ({ slug }) => {
  const scrollRef = useRef(null)
  const client = useApolloClient()

  const policies = fetchOperationPolicies(
    client,
    ORGANIZATION_POLICY_QUERY,
    ['editing', 'deleting']
  )

  const editingAllowed = policies['editing']
  const deletingAllowed = policies['deleting']

  const { loading, error, data } = useQuery(ORGANIZATION_DETAIL_QUERY, {
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
  } else if (!data?.organization) {
    return handleMissingData()
  }

  const { organization } = data

  const slugNameMapping = (() => {
    const map = {}
    map[organization.slug] = organization.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-violet text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3'>
          <OrganizationDetailLeft
            scrollRef={scrollRef}
            organization={organization}
            editingAllowed={editingAllowed}
          />
        </div>
        <div className='lg:basis-2/3'>
          <OrganizationDetailRight
            ref={scrollRef}
            organization={organization}
            editingAllowed={editingAllowed}
            deletingAllowed={deletingAllowed}
          />
        </div>
      </div>
    </div>
  )
}

export default OrganizationDetail
