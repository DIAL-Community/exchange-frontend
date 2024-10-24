import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import { CITY_DETAIL_QUERY } from '../shared/query/city'
import TabNav from '../shared/TabNav'

const CityTabNav = ({ activeTab, setActiveTab }) => {
  const [tabNames, setTabNames] = useState([
    'ui.city.header'
  ])

  useQuery(CITY_DETAIL_QUERY, {
    variables: { slug: crypto.randomUUID() },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.CREATING
      }
    },
    onCompleted: () => {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.city.createNew'),
        'ui.city.createNew'
      ])
    }
  })

  return <TabNav { ...{ tabNames, activeTab, setActiveTab }} />
}

export default CityTabNav
