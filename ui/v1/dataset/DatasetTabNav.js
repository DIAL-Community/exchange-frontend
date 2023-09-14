import { useEffect, useState } from 'react'
import TabNav from '../shared/TabNav'
import { useUser } from '../../../lib/hooks'

const DatasetTabNav = ({ activeTab, setActiveTab }) => {
  const { user } = useUser()

  const [tabNames, setTabNames] = useState([
    'ui.dataset.header',
    'ui.dataset.whatIs'
  ])

  useEffect(() => {
    if (user?.isAdminUser) {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.dataset.createNew'),
        'ui.dataset.createNew'
      ])
    }
  }, [user])

  return <TabNav { ...{ tabNames, activeTab, setActiveTab }} />
}

export default DatasetTabNav
