import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { OrganizationFilterContext } from '../../../components/context/OrganizationFilterContext'
import TabNav from '../shared/TabNav'
import { ExportType, asyncExport, convertKeys } from '../utils/export'
import { useUser } from '../../../lib/hooks'

const OrganizationTabNav = ({ activeTab, setActiveTab }) => {
  const { user } = useUser()
  const router = useRouter()

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
    const { userEmail, userToken } = user
    const exportParameters = convertKeys({ pageSize: -1, ...organizationFilters })
    asyncExport(ExportType.EXPORT_AS_CSV, 'organizations', exportParameters, userEmail, userToken)
  }

  const exportJsonFn = () => {
    const { userEmail, userToken } = user
    const exportParameters = convertKeys({ pageSize: -1, ...organizationFilters })
    asyncExport(ExportType.EXPORT_AS_JSON, 'organizations', exportParameters, userEmail, userToken)
  }

  const createCandidateFn = () => {
    router.push('/candidate/organizations/create')
  }

  return (
    <TabNav
      { ...{ tabNames, activeTab, setActiveTab }}
      createFn={createCandidateFn}
      exportCsvFn={exportCsvFn}
      exportJsonFn={exportJsonFn}
    />
  )
}

export default OrganizationTabNav
