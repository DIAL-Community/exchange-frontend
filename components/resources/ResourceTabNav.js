import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { CREATING_POLICY_SLUG, GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import { RESOURCE_POLICY_QUERY } from '../shared/query/resource'
import TabNav from '../shared/TabNav'

const ResourceTabNav = ({ activeTab, setActiveTab }) => {
  const [tabNames, setTabNames] = useState([
    'ui.resource.header'
  ])

  useQuery(RESOURCE_POLICY_QUERY, {
    variables: { slug: CREATING_POLICY_SLUG },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.CREATING
      }
    },
    onCompleted: () => {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.resource.createNew'),
        'ui.resource.createNew'
      ])
    }
  })

  return (
    <TabNav { ...{ tabNames, activeTab, setActiveTab }} />
  )
}

export default ResourceTabNav
