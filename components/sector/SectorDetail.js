import { useRef, useState } from 'react'
import { useApolloClient, useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import Breadcrumb from '../shared/Breadcrumb'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../shared/GraphQueryHandler'
import { SECTOR_DETAIL_QUERY, SECTOR_POLICY_QUERY } from '../shared/query/sector'
import { fetchOperationPolicies } from '../utils/policy'
import SectorDetailLeft from './SectorDetailLeft'
import SectorDetailRight from './SectorDetailRight'

const SectorDetail = ({ slug }) => {
  const scrollRef = useRef(null)
  const client = useApolloClient()

  const [editingAllowed, setEditingAllowed] = useState(false)
  const [deletingAllowed, setDeletingAllowed] = useState(false)

  const { loading, error, data } = useQuery(SECTOR_DETAIL_QUERY, {
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
  } else if (!data?.sector) {
    return handleMissingData()
  }

  fetchOperationPolicies(
    client,
    SECTOR_POLICY_QUERY,
    ['editing', 'deleting']
  ).then(policies => {
    setEditingAllowed(policies['editing'])
    setDeletingAllowed(policies['deleting'])
  })

  const { sector } = data

  const slugNameMapping = () => {
    const map = {}
    map[sector.slug] = sector.name

    return map
  }

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-violet text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping()}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3 shrink-0'>
          <SectorDetailLeft scrollRef={scrollRef} sector={sector} />
        </div>
        <div className='lg:basis-2/3'>
          <SectorDetailRight
            ref={scrollRef}
            sector={sector}
            editingAllowed={editingAllowed}
            deletingAllowed={deletingAllowed}
          />
        </div>
      </div>
    </div>
  )
}

export default SectorDetail
