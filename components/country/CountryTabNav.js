import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import { COUNTRY_DETAIL_QUERY } from '../shared/query/country'
import TabNav from '../shared/TabNav'

const CountryTabNav = ({ activeTab, setActiveTab }) => {
  const [tabNames, setTabNames] = useState([
    'ui.country.header'
  ])

  useQuery(COUNTRY_DETAIL_QUERY, {
    variables: { slug: '' },
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
