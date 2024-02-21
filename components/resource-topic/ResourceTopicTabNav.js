import { useEffect, useState } from 'react'
import { useUser } from '../../lib/hooks'
import TabNav from '../shared/TabNav'

const ResourceTopicTabNav = ({ activeTab, setActiveTab }) => {
  const { user } = useUser()

  const [tabNames, setTabNames] = useState([
    'ui.resourceTopic.header'
  ])

  useEffect(() => {
    if (user?.isAdminUser) {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.resourceTopic.createNew'),
        'ui.resourceTopic.createNew'
      ])
    }
  }, [user])

  return <TabNav { ...{ tabNames, activeTab, setActiveTab }} />
}

export default ResourceTopicTabNav
