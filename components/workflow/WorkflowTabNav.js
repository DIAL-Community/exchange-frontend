import { useContext, useEffect, useState } from 'react'
import { useUser } from '../../lib/hooks'
import { FilterContext } from '../context/FilterContext'
import TabNav from '../shared/TabNav'
import { asyncExport, convertKeys, ExportType } from '../utils/export'

const WorkflowTabNav = ({ activeTab, setActiveTab }) => {
  const { user } = useUser()

  const [tabNames, setTabNames] = useState([
    'ui.workflow.header',
    'ui.workflow.whatIs'
  ])

  useEffect(() => {
    if (user?.isAdminUser || user?.isEditorUser) {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.workflow.createNew'),
        'ui.workflow.createNew'
      ])
    }
  }, [user])

  const activeFilters = useContext(FilterContext)

  const exportCsvFn = () => {
    const workflowFilters = generateExportFilters(activeFilters)
    const exportParameters = convertKeys({ pageSize: -1, ...workflowFilters })
    asyncExport(ExportType.EXPORT_AS_CSV, 'workflows', exportParameters, user.userEmail)
  }

  const exportJsonFn = () => {
    const workflowFilters = generateExportFilters(activeFilters)
    const exportParameters = convertKeys({ pageSize: -1, ...workflowFilters })
    asyncExport(ExportType.EXPORT_AS_JSON, 'workflows', exportParameters, user.userEmail)
  }

  const generateExportFilters = (activeFilters) => {
    return Object
      .keys(activeFilters)
      .filter(key => {
        return [
          'search',
          'sdgs',
          'useCases'
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
      {...{ tabNames, activeTab, setActiveTab }}
      exportCsvFn={exportCsvFn}
      exportJsonFn={exportJsonFn}
    />
  )
}

export default WorkflowTabNav
