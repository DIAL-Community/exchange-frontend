import { useEffect, useRef, useState } from 'react'
import { useApolloClient, useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import Breadcrumb from '../shared/Breadcrumb'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../shared/GraphQueryHandler'
import { CITY_DETAIL_QUERY, CITY_POLICY_QUERY } from '../shared/query/city'
import { fetchOperationPolicies } from '../utils/policy'
import CityDetailLeft from './CityDetailLeft'
import CityDetailRight from './CityDetailRight'

const CityDetail = ({ slug }) => {
  const scrollRef = useRef(null)
  const client = useApolloClient()

  const [editingAllowed, setEditingAllowed] = useState(false)
  const [deletingAllowed, setDeletingAllowed] = useState(false)

  const { loading, error, data } = useQuery(CITY_DETAIL_QUERY, {
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
      CITY_POLICY_QUERY,
      ['editing', 'deleting']
    ).then(policies => {
      setEditingAllowed(policies['editing'])
      setDeletingAllowed(policies['deleting'])
    })
  }, [client])

  if (loading) {
    return handleLoadingQuery()
  } else if (error) {
    return handleQueryError(error)
  } else if (!data?.city) {
    return handleMissingData()
  }

  const { city } = data

  const slugNameMapping = (() => {
    const map = {}
    map[city.slug] = city.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-violet text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3 shrink-0'>
          <CityDetailLeft scrollRef={scrollRef} city={city} />
        </div>
        <div className='lg:basis-2/3 shrink-0'>
          <CityDetailRight
            ref={scrollRef}
            city={city}
            editingAllowed={editingAllowed}
            deletingAllowed={deletingAllowed}
          />
        </div>
      </div>
    </div>
  )
}

export default CityDetail
