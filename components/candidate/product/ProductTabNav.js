import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { CANDIDATE_PRODUCT_DETAIL_QUERY } from '../../shared/query/candidateProduct'
import TabNav from '../../shared/TabNav'

const ProductTabNav = ({ activeTab, setActiveTab }) => {
  const [tabNames, setTabNames] = useState([
    'ui.candidateProduct.header'
  ])

  useQuery(CANDIDATE_PRODUCT_DETAIL_QUERY, {
    variables: { slug: '' },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.CREATING
      }
    },
    onCompleted: () => {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.candidateProduct.createNew'),
        'ui.candidateProduct.createNew'
      ])
    }
  })

  return <TabNav { ...{ tabNames, activeTab, setActiveTab }} />
}

export default ProductTabNav
