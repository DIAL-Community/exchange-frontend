import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { CANDIDATE_ORGANIZATION_DETAIL_QUERY } from '../../shared/query/candidateOrganization'
import TabNav from '../../shared/TabNav'

const OrganizationTabNav = ({ activeTab, setActiveTab }) => {
  const [tabNames, setTabNames] = useState([
    'ui.candidateOrganization.header'
  ])

  useQuery(CANDIDATE_ORGANIZATION_DETAIL_QUERY, {
    variables: { slug: '' },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.CREATING
      }
    },
    onCompleted: () => {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.organization.createNew'),
        'ui.candidateOrganization.createNew'
      ])
    }
  })

  return <TabNav { ...{ tabNames, activeTab, setActiveTab }} />
}

export default OrganizationTabNav
