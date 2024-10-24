import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { CREATING_POLICY_SLUG, GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import { RUBRIC_CATEGORY_QUERY } from '../shared/query/rubricCategory'
import TabNav from '../shared/TabNav'

const RubricCategoryTabNav = ({ activeTab, setActiveTab }) => {
  const [tabNames, setTabNames] = useState([
    'ui.rubricCategory.header'
  ])

  useQuery(RUBRIC_CATEGORY_QUERY, {
    variables: { slug: CREATING_POLICY_SLUG },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.CREATING
      }
    },
    onCompleted: () => {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.rubricCategory.createNew'),
        'ui.rubricCategory.createNew'
      ])
    }
  })

  return <TabNav { ...{ tabNames, activeTab, setActiveTab }} />
}

export default RubricCategoryTabNav
