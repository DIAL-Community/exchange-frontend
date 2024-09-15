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

  const activeFilters = useContext(BuildingBlockFilterContext)

  const exportCsvFn = () => {
    const buildingBlockFilters = generateExportFilters(activeFilters)
    const exportParameters = convertKeys({ pageSize: -1, ...buildingBlockFilters })
    asyncExport(ExportType.EXPORT_AS_CSV, 'building_blocks', exportParameters, user.userEmail)
  }

  const exportJsonFn = () => {
    const buildingBlockFilters = generateExportFilters(activeFilters)
    const exportParameters = convertKeys({ pageSize: -1, ...buildingBlockFilters })
    asyncExport(ExportType.EXPORT_AS_JSON, 'building_blocks', exportParameters, user.userEmail)
  }

  const generateExportFilters = (activeFilters) => {
    return Object
      .keys(activeFilters)
      .filter(key => {
        return [
          'search',
          'sdgs',
          'useCases',
          'workflows',
          'categoryTypes',
          'showMature',
          'showGovStackOnly'
        ].indexOf(key) !== -1
      })
      .map(key => ({
        key,
        value: activeFilters[key]
      }))
      .reduce((accumulator, object) => {
        accumulator[object.key] = object.value

        return accumulator
      }, {})
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
