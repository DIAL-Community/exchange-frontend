import { useEffect, useState } from 'react'
import TabNav from '../shared/TabNav'
import { useUser } from '../../lib/hooks'

const SyncTabNav = ({ activeTab, setActiveTab }) => {
  const { user } = useUser()

  const [tabNames, setTabNames] = useState([
    'ui.sync.header'
  ])

  useEffect(() => {
    if (user?.isAdminUser) {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.sync.createNew'),
        'ui.sync.createNew'
      ])
    }
  }, [user])

  return <TabNav { ...{ tabNames, activeTab, setActiveTab }} />
}

export default SyncTabNav
