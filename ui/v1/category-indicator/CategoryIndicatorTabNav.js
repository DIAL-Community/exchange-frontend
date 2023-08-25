import { useEffect, useState } from 'react'
import TabNav from '../shared/TabNav'
import { useUser } from '../../../lib/hooks'

const CategoryIndicatorTabNav = ({ activeTab, setActiveTab }) => {
  const { user } = useUser()

  const [tabNames, setTabNames] = useState([
    'ui.categoryIndicator.header',
    'ui.categoryIndicator.whatIs'
  ])

  useEffect(() => {
    if (user && user?.isAdminUser) {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.categoryIndicator.createNew'),
        'ui.categoryIndicator.createNew'
      ])
    }
  }, [user])

  return <TabNav { ...{ tabNames, activeTab, setActiveTab }} />
}

export default CategoryIndicatorTabNav
