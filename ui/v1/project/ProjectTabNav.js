import { useContext, useEffect, useState } from 'react'
import { ProjectFilterContext } from '../../../components/context/ProjectFilterContext'
import TabNav from '../shared/TabNav'
import { ExportType, asyncExport, convertKeys } from '../utils/export'
import { useUser } from '../../../lib/hooks'

const ProjectTabNav = ({ activeTab, setActiveTab }) => {
  const { user } = useUser()

  const [tabNames, setTabNames] = useState([
    'ui.project.header',
    'ui.project.whatIs'
  ])

  useEffect(() => {
    if (user?.isAdminUser) {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.project.createNew'),
        'ui.project.createNew'
      ])
    }
  }, [user])

  const projectFilters = useContext(ProjectFilterContext)

  const exportCsvFn = () => {
    const exportParameters = convertKeys({ pageSize: -1, ...projectFilters })
    asyncExport(ExportType.EXPORT_AS_CSV, 'projects', exportParameters, user.userEmail)
  }

  const exportJsonFn = () => {
    const exportParameters = convertKeys({ pageSize: -1, ...projectFilters })
    asyncExport(ExportType.EXPORT_AS_JSON, 'projects', exportParameters, user.userEmail)
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
