import { useEffect, useState } from 'react'
import TabNav from '../../shared/TabNav'
import { useUser } from '../../../lib/hooks'

const OrganizationTabNav = ({ activeTab, setActiveTab }) => {
  const { user } = useUser()

  const [tabNames, setTabNames] = useState([
    'ui.candidateOrganization.header'
  ])

  useEffect(() => {
    if (user?.isAdminUser || user?.isEditorUser) {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.organization.createNew'),
        'ui.candidateOrganization.createNew'
      ])
    }
  }, [user])

  return <TabNav { ...{ tabNames, activeTab, setActiveTab }} />
}

export default OrganizationTabNav
