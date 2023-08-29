import { useContext, useEffect, useState } from 'react'
import { BuildingBlockFilterContext } from '../../../components/context/BuildingBlockFilterContext'
import TabNav from '../shared/TabNav'
import { ExportType, asyncExport, convertKeys } from '../utils/export'
import { useUser } from '../../../lib/hooks'

const BuildingBlockTabNav = ({ activeTab, setActiveTab }) => {
  const { user } = useUser()

  const [tabNames, setTabNames] = useState([
    'ui.buildingBlock.header',
    'ui.buildingBlock.whatIs'
  ])

  useEffect(() => {
    if (user?.isAdminUser) {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.buildingBlock.createNew'),
        'ui.buildingBlock.createNew'
      ])
    }
  }, [user])

  const buildingBlockFilters = useContext(BuildingBlockFilterContext)

  const exportCsvFn = () => {
    const exportParameters = convertKeys({ pageSize: -1, ...buildingBlockFilters })
    asyncExport(ExportType.EXPORT_AS_CSV, 'building_blocks', exportParameters, user.userEmail)
  }

  const exportJsonFn = () => {
    const exportParameters = convertKeys({ pageSize: -1, ...buildingBlockFilters })
    asyncExport(ExportType.EXPORT_AS_JSON, 'building_blocks', exportParameters, user.userEmail)
  }

  return (
    <TabNav
      { ...{ tabNames, activeTab, setActiveTab }}
      exportCsvFn={exportCsvFn}
      exportJsonFn={exportJsonFn}
    />
  )
}

export default BuildingBlockTabNav
