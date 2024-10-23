import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import { RUBRIC_CATEGORY_QUERY } from '../shared/query/rubricCategory'
import TabNav from '../shared/TabNav'

const RubricCategoryTabNav = ({ activeTab, setActiveTab }) => {
  const [tabNames, setTabNames] = useState([
    'ui.rubricCategory.header'
  ])

  useQuery(RUBRIC_CATEGORY_QUERY, {
    variables: { slug: '' },
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
