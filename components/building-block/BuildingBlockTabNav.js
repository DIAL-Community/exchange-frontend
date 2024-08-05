import { useContext, useEffect, useState } from 'react'
import { useUser } from '../../lib/hooks'
import { BuildingBlockFilterContext } from '../context/BuildingBlockFilterContext'
import TabNav from '../shared/TabNav'
import { asyncExport, convertKeys, ExportType } from '../utils/export'

const BuildingBlockTabNav = ({ activeTab, setActiveTab }) => {
  const { user } = useUser()

  const [tabNames, setTabNames] = useState([
    'ui.buildingBlock.header',
    'ui.buildingBlock.whatIs'
  ])

  useEffect(() => {
    if (user?.isAdminUser || user?.isEditorUser) {
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
