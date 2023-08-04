import { useContext, useEffect, useState } from 'react'
import { SdgFilterContext } from '../../../components/context/SdgFilterContext'
import TabNav from '../shared/TabNav'
import { ExportType, asyncExport, convertKeys } from '../utils/export'
import { useUser } from '../../../lib/hooks'

const SdgTabNav = ({ activeTab, setActiveTab }) => {
  const { user } = useUser()

  const [tabNames, setTabNames] = useState([
    'ui.sdg.header',
    'ui.sdg.whatIs'
  ])

  useEffect(() => {
    if (user?.isAdminUser) {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.sdg.createNew'),
        'ui.sdg.createNew'
      ])
    }
  }, [user])

  const sdgFilters = useContext(SdgFilterContext)

  const exportCsvFn = () => {
    const exportParameters = convertKeys({ pageSize: -1, ...sdgFilters })
    asyncExport(ExportType.EXPORT_AS_CSV, 'sdgs', exportParameters, user.userEmail)
  }

  const exportJsonFn = () => {
    const exportParameters = convertKeys({ pageSize: -1, ...sdgFilters })
    asyncExport(ExportType.EXPORT_AS_JSON, 'sdgs', exportParameters, user.userEmail)
  }

  return (
    <TabNav
      { ...{ tabNames, activeTab, setActiveTab }}
      exportCsvFn={exportCsvFn}
      exportJsonFn={exportJsonFn}
    />
  )
}

export default SdgTabNav
