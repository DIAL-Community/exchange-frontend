import { useEffect, useState } from 'react'
import { useUser } from '../../lib/hooks'
import TabNav from '../shared/TabNav'

const TenantSettingTabNav = ({ activeTab, setActiveTab }) => {
  const { user } = useUser()

  const [tabNames, setTabNames] = useState([
    'ui.tenantSetting.header'
  ])

  useEffect(() => {
    if (user?.isAdminUser || user?.isEditorUser) {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.tenantSetting.createNew'),
        'ui.tenantSetting.createNew'
      ])
    }
  }, [user])

  return <TabNav { ...{ tabNames, activeTab, setActiveTab }} />
}

export default TenantSettingTabNav
