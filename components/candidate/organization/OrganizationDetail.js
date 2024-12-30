import { useEffect, useRef, useState } from 'react'
import { useApolloClient, useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import Breadcrumb from '../../shared/Breadcrumb'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../shared/GraphQueryHandler'
import {
  CANDIDATE_ORGANIZATION_DETAIL_QUERY, CANDIDATE_ORGANIZATION_POLICY_QUERY
} from '../../shared/query/candidateOrganization'
import { fetchOperationPolicies } from '../../utils/policy'
import OrganizationDetailLeft from './OrganizationDetailLeft'
import OrganizationDetailRight from './OrganizationDetailRight'

const OrganizationDetail = ({ slug }) => {
  const scrollRef = useRef(null)
  const client = useApolloClient()

  const [editingAllowed, setEditingAllowed] = useState(false)

  const { loading, error, data, refetch } = useQuery(CANDIDATE_ORGANIZATION_DETAIL_QUERY, {
    variables: { slug },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  useEffect(() => {
    fetchOperationPolicies(
      client,
      CANDIDATE_ORGANIZATION_POLICY_QUERY,
      ['editing']
    ).then(policies => {
      setEditingAllowed(policies['editing'])
    })
  }, [client])

  if (loading) {
    return handleLoadingQuery()
  } else if (error) {
    return handleQueryError(error)
  } else if (!data?.candidateOrganization) {
    return handleMissingData()
  }

  const { candidateOrganization: organization } = data

  const slugNameMapping = () => {
    const map = {}
    map[organization.slug] = organization.name

    return map
  }

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col text-dial-stratos '>
      <div className='px-4 lg:px-6 py-4 bg-dial-violet ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping()}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3 shrink-0'>
          <OrganizationDetailLeft
            organization={organization}
            scrollRef={scrollRef}
          />
        </div>
        <div className='lg:basis-2/3'>
          <OrganizationDetailRight
            ref={scrollRef}
            refetch={refetch}
            organization={organization}
            editingAllowed={editingAllowed}
          />
        </div>
      </div>
    </div>
  )
}

export default OrganizationDetail
