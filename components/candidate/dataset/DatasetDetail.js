import { useEffect, useRef, useState } from 'react'
import { useApolloClient, useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import Breadcrumb from '../../shared/Breadcrumb'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../shared/GraphQueryHandler'
import { CANDIDATE_DATASET_DETAIL_QUERY, CANDIDATE_DATASET_POLICY_QUERY } from '../../shared/query/candidateDataset'
import { fetchOperationPolicies } from '../../utils/policy'
import DatasetDetailLeft from './DatasetDetailLeft'
import DatasetDetailRight from './DatasetDetailRight'

const DatasetDetail = ({ slug }) => {
  const scrollRef = useRef(null)
  const client = useApolloClient()

  const [editingAllowed, setEditingAllowed] = useState(false)

  const { loading, error, data } = useQuery(CANDIDATE_DATASET_DETAIL_QUERY, {
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
      CANDIDATE_DATASET_POLICY_QUERY,
      ['editing']
    ).then(policies => {
      setEditingAllowed(policies['editing'])
    })
  }, [client])

  if (loading) {
    return handleLoadingQuery()
  } else if (error) {
    return handleQueryError(error)
  } else if (!data?.candidateDataset) {
    return handleMissingData()
  }

  const { candidateDataset: dataset } = data

  const slugNameMapping = (() => {
    const map = {}
    map[dataset.slug] = dataset.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-spearmint text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3 shrink-0'>
          <DatasetDetailLeft dataset={dataset} scrollRef={scrollRef} />
        </div>
        <div className='lg:basis-2/3 shrink-0'>
          <DatasetDetailRight ref={scrollRef} dataset={dataset} editingAllowed={editingAllowed} />
        </div>
      </div>
    </div>
  )
}

export default DatasetDetail
