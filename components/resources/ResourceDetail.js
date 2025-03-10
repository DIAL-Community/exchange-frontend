import { useRef, useState, useCallback } from 'react'
import { useApolloClient, useQuery } from '@apollo/client'
import { useIntl } from 'react-intl'
import { GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import Breadcrumb from '../shared/Breadcrumb'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../shared/GraphQueryHandler'
import { RESOURCE_DETAIL_QUERY, RESOURCE_POLICY_QUERY } from '../shared/query/resource'
import { fetchOperationPolicies } from '../utils/policy'
import ResourceDetailLeft from './ResourceDetailLeft'
import ResourceDetailRight from './ResourceDetailRight'

const ResourceDetail = ({ slug, country }) => {
  const scrollRef = useRef(null)
  const client = useApolloClient()

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [editingAllowed, setEditingAllowed] = useState(false)
  const [deletingAllowed, setDeletingAllowed] = useState(false)

  const { loading, error, data } = useQuery(RESOURCE_DETAIL_QUERY, {
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
  } else if (!data?.resource) {
    return handleMissingData()
  }

  fetchOperationPolicies(
    client,
    RESOURCE_POLICY_QUERY,
    ['editing', 'deleting']
  ).then(policies => {
    setEditingAllowed(policies['editing'])
    setDeletingAllowed(policies['deleting'])
  })

  const { resource } = data

  const slugNameMapping = () => {
    const map = {}
    map[resource.slug] = resource.name

    if (country) {
      map['countries'] = format('hub.breadcrumb.country')
      map[country.slug] = country.name
    }

    return map
  }

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-violet text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping()}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3 shrink-0'>
          <ResourceDetailLeft
            scrollRef={scrollRef}
            resource={resource}
            editingAllowed={editingAllowed}
          />
        </div>
        <div className='lg:basis-2/3'>
          <ResourceDetailRight
            ref={scrollRef}
            resource={resource}
            editingAllowed={editingAllowed}
            deletingAllowed={deletingAllowed}
          />
        </div>
      </div>
    </div>
  )
}

export default ResourceDetail
