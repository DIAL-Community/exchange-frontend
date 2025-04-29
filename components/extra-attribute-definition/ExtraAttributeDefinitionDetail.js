import { useRef, useState } from 'react'
import { useApolloClient, useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import Breadcrumb from '../shared/Breadcrumb'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../shared/GraphQueryHandler'
import {
  EXTRA_ATTRIBUTE_DEFINITION_DETAIL_QUERY,
  EXTRA_ATTRIBUTE_DEFINITION_POLICY_QUERY
} from '../shared/query/extraAttributeDefinition'
import { fetchOperationPolicies } from '../utils/policy'
import ExtraAttributeDefinitionDetailLeft from './ExtraAttributeDefinitionDetailLeft'
import ExtraAttributeDefinitionDetailRight from './ExtraAttributeDefinitionDetailRight'

const ExtraAttributeDefinitionDetail = ({ slug }) => {
  const scrollRef = useRef(null)
  const client = useApolloClient()

  const [editingAllowed, setEditingAllowed] = useState(false)
  const [deletingAllowed, setDeletingAllowed] = useState(false)

  const { loading, error, data } = useQuery(EXTRA_ATTRIBUTE_DEFINITION_DETAIL_QUERY, {
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
  } else if (!data?.extraAttributeDefinition) {
    return handleMissingData()
  }

  fetchOperationPolicies(
    client,
    EXTRA_ATTRIBUTE_DEFINITION_POLICY_QUERY,
    ['editing', 'deleting']
  ).then(policies => {
    setEditingAllowed(policies['editing'])
    setDeletingAllowed(policies['deleting'])
  })

  const { extraAttributeDefinition } = data

  const slugNameMapping = () => {
    const map = {}
    map[extraAttributeDefinition.slug] = extraAttributeDefinition.name

    return map
  }

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-violet text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping()}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3 shrink-0'>
          <ExtraAttributeDefinitionDetailLeft scrollRef={scrollRef} extraAttributeDefinition={extraAttributeDefinition} />
        </div>
        <div className='lg:basis-2/3'>
          <ExtraAttributeDefinitionDetailRight
            ref={scrollRef}
            extraAttributeDefinition={extraAttributeDefinition}
            editingAllowed={editingAllowed}
            deletingAllowed={deletingAllowed}
          />
        </div>
      </div>
    </div>
  )
}

export default ExtraAttributeDefinitionDetail
