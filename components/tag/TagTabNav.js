import { useEffect, useState } from 'react'
import { useUser } from '../../lib/hooks'
import TabNav from '../shared/TabNav'

const TagTabNav = ({ activeTab, setActiveTab }) => {
  const { user } = useUser()

  const [tabNames, setTabNames] = useState([
    'ui.tag.header'
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
