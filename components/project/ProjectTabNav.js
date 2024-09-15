import { useContext, useEffect, useState } from 'react'
import { useUser } from '../../lib/hooks'
import { ProjectFilterContext } from '../context/ProjectFilterContext'
import TabNav from '../shared/TabNav'
import { asyncExport, convertKeys, ExportType } from '../utils/export'

const ProjectTabNav = ({ activeTab, setActiveTab }) => {
  const { user } = useUser()

  const [tabNames, setTabNames] = useState([
    'ui.project.header',
    'ui.project.whatIs'
  ])

  useEffect(() => {
    if (user?.isAdminUser || user?.isEditorUser) {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.project.createNew'),
        'ui.project.createNew'
      ])
    }
  }, [user])

  const activeFilters = useContext(ProjectFilterContext)

  const exportCsvFn = () => {
    const projectFilters = generateExportFilters(activeFilters)
    const exportParameters = convertKeys({ pageSize: -1, ...projectFilters })
    asyncExport(ExportType.EXPORT_AS_CSV, 'projects', exportParameters, user.userEmail)
  }

  const exportJsonFn = () => {
    const projectFilters = generateExportFilters(activeFilters)
    const exportParameters = convertKeys({ pageSize: -1, ...projectFilters })
    asyncExport(ExportType.EXPORT_AS_JSON, 'projects', exportParameters, user.userEmail)
  }

  const generateExportFilters = (activeFilters) => {
    return Object
      .keys(activeFilters)
      .filter(key => {
        return [
          'search',
          'countries',
          'organizations',
          'origins',
          'products',
          'sdgs',
          'sectors',
          'tags'
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

export default ProjectTabNav
