import { useEffect, useState } from 'react'
import { useUser } from '../../../lib/hooks'
import TabNav from '../../shared/TabNav'

const ResourceTabNav = ({ activeTab, setActiveTab }) => {
  const { user } = useUser()

  const [tabNames, setTabNames] = useState([
    'ui.candidateResource.header'
  ])

  useEffect(() => {
    if (user?.isAdminUser || user?.isEditorUser) {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.candidateResource.createNew'),
        'ui.candidateResource.createNew'
      ])
    }
  }, [user])

  return <TabNav { ...{ tabNames, activeTab, setActiveTab }} />
}

export default ResourceTabNav
