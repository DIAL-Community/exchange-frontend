import { useEffect, useState } from 'react'
import TabNav from '../shared/TabNav'
import { useUser } from '../../../lib/hooks'

const TagTabNav = ({ activeTab, setActiveTab }) => {
  const { user } = useUser()

  const [tabNames, setTabNames] = useState([
    'ui.tag.header',
    'ui.tag.whatIs'
  ])

  useEffect(() => {
    if (user?.isAdminUser) {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.tag.createNew'),
        'ui.tag.createNew'
      ])
    }
  }, [user])

  return <TabNav { ...{ tabNames, activeTab, setActiveTab }} />
}

export default TagTabNav
