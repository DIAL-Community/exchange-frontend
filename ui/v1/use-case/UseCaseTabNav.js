import { useContext, useEffect, useState } from 'react'
import { UseCaseFilterContext } from '../../../components/context/UseCaseFilterContext'
import TabNav from '../shared/TabNav'
import { ExportType, asyncExport, convertKeys } from '../utils/export'
import { useUser } from '../../../lib/hooks'

const UseCaseTabNav = ({ activeTab, setActiveTab }) => {
  const { user } = useUser()

  const [tabNames, setTabNames] = useState([
    'ui.useCase.header',
    'ui.useCase.whatIs'
  ])

  useEffect(() => {
    if (user?.isAdminUser) {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.useCase.createNew'),
        'ui.useCase.createNew'
      ])
    }
  }, [user])

  const useCaseFilters = useContext(UseCaseFilterContext)

  const exportCsvFn = () => {
    const exportParameters = convertKeys({ pageSize: -1, ...useCaseFilters })
    asyncExport(ExportType.EXPORT_AS_CSV, 'use_cases', exportParameters, user.userEmail)
  }

  const exportJsonFn = () => {
    const exportParameters = convertKeys({ pageSize: -1, ...useCaseFilters })
    asyncExport(ExportType.EXPORT_AS_JSON, 'use_cases', exportParameters, user.userEmail)
  }

  return (
    <TabNav
      { ...{ tabNames, activeTab, setActiveTab }}
      exportCsvFn={exportCsvFn}
      exportJsonFn={exportJsonFn}
    />
  )
}

export default UseCaseTabNav
