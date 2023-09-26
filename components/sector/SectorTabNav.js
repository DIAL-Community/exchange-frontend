import { useEffect, useState } from 'react'
import TabNav from '../shared/TabNav'
import { useUser } from '../../lib/hooks'

const SectorTabNav = ({ activeTab, setActiveTab }) => {
  const { user } = useUser()

  const [tabNames, setTabNames] = useState([
    'ui.sector.header',
    'ui.sector.whatIs'
  ])

  useEffect(() => {
    if (user?.isAdminUser) {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.sector.createNew'),
        'ui.sector.createNew'
      ])
    }
  }, [user])

  return <TabNav { ...{ tabNames, activeTab, setActiveTab }} />
}

export default SectorTabNav
