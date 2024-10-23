import { useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import { DATASET_DETAIL_QUERY } from '../shared/query/dataset'
import TabNav from '../shared/TabNav'

const DatasetTabNav = ({ activeTab, setActiveTab }) => {
  const router = useRouter()

  const [tabNames, setTabNames] = useState([
    'ui.dataset.header',
    'ui.dataset.whatIs'
  ])

  useQuery(DATASET_DETAIL_QUERY, {
    variables: { slug: '' },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.CREATING
      }
    },
    onCompleted: () => {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.dataset.createNew'),
        'ui.dataset.createNew'
      ])
    }
  })

  const createCandidateFn = () => {
    router.push('/candidate/datasets/create')
  }

  return <TabNav { ...{ tabNames, activeTab, setActiveTab }} createFn={createCandidateFn} />
}

export default DatasetTabNav
