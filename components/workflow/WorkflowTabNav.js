import { useContext, useState } from 'react'
import { useQuery } from '@apollo/client'
import { CREATING_POLICY_SLUG, GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import { useUser } from '../../lib/hooks'
import { FilterContext } from '../context/FilterContext'
import { WORKFLOW_POLICY_QUERY } from '../shared/query/workflow'
import TabNav from '../shared/TabNav'
import { asyncExport, convertKeys, ExportType } from '../utils/export'

const WorkflowTabNav = ({ activeTab, setActiveTab }) => {
  const { user } = useUser()

  const [tabNames, setTabNames] = useState([
    'ui.workflow.header',
    'ui.workflow.whatIs'
  ])

  useQuery(WORKFLOW_POLICY_QUERY, {
    variables: { slug: CREATING_POLICY_SLUG },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.CREATING
      }
    },
    onCompleted: () => {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.workflow.createNew'),
        'ui.workflow.createNew'
      ])
    }
  })

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
