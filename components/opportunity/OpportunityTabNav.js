import { useEffect, useState } from 'react'
import TabNav from '../shared/TabNav'
import { useUser } from '../../../lib/hooks'

const OpportunityTabNav = ({ activeTab, setActiveTab }) => {
  const { user } = useUser()

  const [tabNames, setTabNames] = useState([
    'ui.opportunity.header',
    'ui.opportunity.whatIs'
  ])

  useEffect(() => {
    if (user?.isAdminUser) {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.opportunity.createNew'),
        'ui.opportunity.createNew'
      ])
    }
  }, [user])

  return <TabNav { ...{ tabNames, activeTab, setActiveTab }} />
}

export default OpportunityTabNav
