import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { CANDIDATE_DATASET_DETAIL_QUERY } from '../../shared/query/candidateDataset'
import TabNav from '../../shared/TabNav'

const DatasetTabNav = ({ activeTab, setActiveTab }) => {
  const [tabNames, setTabNames] = useState([
    'ui.candidateDataset.header'
  ])

  useQuery(CANDIDATE_DATASET_DETAIL_QUERY, {
    variables: { slug: '' },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.CREATING
      }
    },
    onCompleted: () => {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.candidateDataset.createNew'),
        'ui.candidateDataset.createNew'
      ])
    }
  })

  return <TabNav { ...{ tabNames, activeTab, setActiveTab }} />
}

export default DatasetTabNav
