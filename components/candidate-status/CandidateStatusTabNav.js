import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import { CANDIDATE_STATUS_DETAIL_QUERY } from '../shared/query/candidateStatus'
import TabNav from '../shared/TabNav'

const CandidateStatusTabNav = ({ activeTab, setActiveTab }) => {
  const [tabNames, setTabNames] = useState([
    'ui.candidateStatus.header'
  ])

  useQuery(CANDIDATE_STATUS_DETAIL_QUERY, {
    variables: { slug: '' },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.CREATING
      }
    },
    onCompleted: () => {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.candidateStatus.createNew'),
        'ui.candidateStatus.createNew'
      ])
    }
  })

  return <TabNav { ...{ tabNames, activeTab, setActiveTab }} />
}

export default CandidateStatusTabNav
