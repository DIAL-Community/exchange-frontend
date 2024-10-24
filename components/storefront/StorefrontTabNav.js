import { useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import { CREATING_POLICY_SLUG, GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import { STOREFRONT_POLICY_QUERY } from '../shared/query/organization'
import TabNav from '../shared/TabNav'

const StorefrontTabNav = ({ activeTab, setActiveTab }) => {
  const router = useRouter()

  const [tabNames, setTabNames] = useState([
    'ui.storefront.header',
    'ui.storefront.whatIs'
  ])

  useQuery(STOREFRONT_POLICY_QUERY, {
    variables: { slug: CREATING_POLICY_SLUG },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.CREATING
      }
    },
    onCompleted: () => {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.storefront.createNew'),
        'ui.storefront.createNew'
      ])
    }
  })

  const createCandidateFn = () => {
    router.push('/storefronts/create')
  }

  return <TabNav { ...{ tabNames, activeTab, setActiveTab }} createFn={createCandidateFn} />
}

export default StorefrontTabNav
