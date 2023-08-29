import { useEffect, useState } from 'react'
import TabNav from '../shared/TabNav'
import { useUser } from '../../../lib/hooks'

const ResourceTabNav = ({ activeTab, setActiveTab }) => {
  const { user } = useUser()

  const [tabNames, setTabNames] = useState([
    'ui.resource.header'
  ])

  useEffect(() => {
    if (user?.isAdminUser) {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.resource.createNew'),
        'ui.resource.createNew'
      ])
    }
  }, [user])

  return <TabNav { ...{ tabNames, activeTab, setActiveTab }} />
}

export default ResourceTabNav
