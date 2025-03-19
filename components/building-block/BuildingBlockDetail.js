import { useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useApolloClient, useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import Breadcrumb from '../shared/Breadcrumb'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../shared/GraphQueryHandler'
import { BUILDING_BLOCK_DETAIL_QUERY, BUILDING_BLOCK_POLICY_QUERY } from '../shared/query/buildingBlock'
import { fetchOperationPolicies } from '../utils/policy'
import BuildingBlockDetailLeft from './BuildingBlockDetailLeft'
import BuildingBlockDetailRight from './BuildingBlockDetailRight'

const BuildingBlockDetail = ({ slug }) => {
  const scrollRef = useRef(null)
  const client = useApolloClient()

  const router = useRouter()
  const { locale } = router

  const [editingAllowed, setEditingAllowed] = useState(false)
  const [deletingAllowed, setDeletingAllowed] = useState(false)

  const { loading, error, data } = useQuery(BUILDING_BLOCK_DETAIL_QUERY, {
    variables: { slug },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING,
        'Accept-Language': locale
      }
    }
  })

  if (loading) {
    return handleLoadingQuery()
  } else if (error) {
    return handleQueryError(error)
  } else if (!data?.buildingBlock) {
    return handleMissingData()
  }

  fetchOperationPolicies(
    client,
    BUILDING_BLOCK_POLICY_QUERY,
    ['editing', 'deleting']
  ).then(policies => {
    setEditingAllowed(policies['editing'])
    setDeletingAllowed(policies['deleting'])
  })

  const { buildingBlock } = data

  const slugNameMapping = () => {
    const map = {}
    map[buildingBlock.slug] = buildingBlock.name

    return map
  }

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-warm-beech text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping()}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3 shrink-0'>
          <BuildingBlockDetailLeft
            scrollRef={scrollRef}
            buildingBlock={buildingBlock}
          />
        </div>
        <div className='lg:basis-2/3'>
          <BuildingBlockDetailRight
            ref={scrollRef}
            buildingBlock={buildingBlock}
            editingAllowed={editingAllowed}
            deletingAllowed={deletingAllowed}
          />
        </div>
      </div>
    </div>
  )
}

export default BuildingBlockDetail
