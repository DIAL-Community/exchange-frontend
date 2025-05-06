import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { CREATING_POLICY_SLUG, GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import { EXTRA_ATTRIBUTE_DEFINITION_POLICY_QUERY } from '../shared/query/extraAttributeDefinition'
import TabNav from '../shared/TabNav'

const ExtraAttributeDefinitionTabNav = ({ activeTab, setActiveTab }) => {
  const [tabNames, setTabNames] = useState([
    'ui.extraAttributeDefinition.header'
  ])

  useQuery(EXTRA_ATTRIBUTE_DEFINITION_POLICY_QUERY, {
    variables: { slug: CREATING_POLICY_SLUG },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.CREATING
      }
    },
    onCompleted: () => {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.extraAttributeDefinition.createNew'),
        'ui.extraAttributeDefinition.createNew'
      ])
    }
  })

  return <TabNav { ...{ tabNames, activeTab, setActiveTab }} />
}

export default ExtraAttributeDefinitionTabNav
