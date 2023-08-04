import { useContext, useEffect, useState } from 'react'
import { OrganizationFilterContext } from '../../../../components/context/OrganizationFilterContext'
import TabNav from '../../shared/TabNav'
import { ExportType, asyncExport, convertKeys } from '../../utils/export'
import { useUser } from '../../../../lib/hooks'

const OrganizationTabNav = ({ activeTab, setActiveTab }) => {
  const { user } = useUser()

  const [tabNames, setTabNames] = useState([
    'ui.organization.header',
    'ui.organization.whatIs'
  ])

  useEffect(() => {
    if (user?.isAdminUser) {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.organization.createNew'),
        'ui.organization.createNew'
      ])
    }
  }, [user])

  const organizationFilters = useContext(OrganizationFilterContext)

  const exportCsvFn = () => {
    const exportParameters = convertKeys({ pageSize: -1, ...organizationFilters })
    asyncExport(ExportType.EXPORT_AS_CSV, 'organizations', exportParameters, user.userEmail)
  }

  const exportJsonFn = () => {
    const exportParameters = convertKeys({ pageSize: -1, ...organizationFilters })
    asyncExport(ExportType.EXPORT_AS_JSON, 'organizations', exportParameters, user.userEmail)
  }

  return (
    <TabNav
      { ...{ tabNames, activeTab, setActiveTab }}
      exportCsvFn={exportCsvFn}
      exportJsonFn={exportJsonFn}
    />
  )
}

export default OrganizationTabNav
