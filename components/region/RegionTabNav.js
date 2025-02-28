import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { CREATING_POLICY_SLUG, GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import { REGION_POLICY_QUERY } from '../shared/query/region'
import TabNav from '../shared/TabNav'

const RegionTabNav = ({ activeTab, setActiveTab }) => {
  const [tabNames, setTabNames] = useState([
    'ui.region.header'
  ])

  useQuery(REGION_POLICY_QUERY, {
    variables: { slug: CREATING_POLICY_SLUG },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.CREATING
      }
    },
    onCompleted: () => {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.region.createNew'),
        'ui.region.createNew'
      ])
    }
  })

  return <TabNav { ...{ tabNames, activeTab, setActiveTab }} />
}

export default RegionTabNav
