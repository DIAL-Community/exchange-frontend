import { useContext, useEffect, useState } from 'react'
import { WorkflowFilterContext } from '../context/WorkflowFilterContext'
import TabNav from '../shared/TabNav'
import { ExportType, asyncExport, convertKeys } from '../utils/export'
import { useUser } from '../../lib/hooks'

const WorkflowTabNav = ({ activeTab, setActiveTab }) => {
  const { user } = useUser()

  const [tabNames, setTabNames] = useState([
    'ui.workflow.header',
    'ui.workflow.whatIs'
  ])

  useEffect(() => {
    if (user && user?.isAdminUser) {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.workflow.createNew'),
        'ui.workflow.createNew'
      ])
    }
  }, [user])

  const workflowFilters = useContext(WorkflowFilterContext)

  const exportCsvFn = () => {
    const exportParameters = convertKeys({ pageSize: -1, ...workflowFilters })
    asyncExport(ExportType.EXPORT_AS_CSV, 'workflows', exportParameters, user.userEmail)
  }

  const exportJsonFn = () => {
    const exportParameters = convertKeys({ pageSize: -1, ...workflowFilters })
    asyncExport(ExportType.EXPORT_AS_JSON, 'workflows', exportParameters, user.userEmail)
  }

  return (
    <TabNav
      { ...{ tabNames, activeTab, setActiveTab }}
      exportCsvFn={exportCsvFn}
      exportJsonFn={exportJsonFn}
    />
  )
}

export default WorkflowTabNav
