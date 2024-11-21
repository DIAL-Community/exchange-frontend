import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { CREATING_POLICY_SLUG, GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import { COUNTRY_POLICY_QUERY } from '../shared/query/country'
import TabNav from '../shared/TabNav'

const CountryTabNav = ({ activeTab, setActiveTab }) => {
  const [tabNames, setTabNames] = useState([
    'ui.country.header'
  ])

  useQuery(COUNTRY_POLICY_QUERY, {
    variables: { slug: CREATING_POLICY_SLUG },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.CREATING
      }
    },
    onCompleted: () => {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.country.createNew'),
        'ui.country.createNew'
      ])
    }
  })

  return <TabNav { ...{ tabNames, activeTab, setActiveTab }} />
}

export default CountryTabNav
