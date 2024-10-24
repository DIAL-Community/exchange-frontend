import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { CANDIDATE_RESOURCE_DETAIL_QUERY } from '../../shared/query/candidateResource'
import TabNav from '../../shared/TabNav'

const ResourceTabNav = ({ activeTab, setActiveTab }) => {
  const [tabNames, setTabNames] = useState([
    'ui.candidateResource.header'
  ])

  useQuery(CANDIDATE_RESOURCE_DETAIL_QUERY, {
    variables: { slug: crypto.randomUUID() },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.CREATING
      }
    },
    onCompleted: () => {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.candidateResource.createNew'),
        'ui.candidateResource.createNew'
      ])
    }
  })

  return <TabNav { ...{ tabNames, activeTab, setActiveTab }} />
}

export default ResourceTabNav
