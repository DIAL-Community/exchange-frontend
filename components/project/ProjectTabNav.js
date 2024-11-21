import { useContext, useState } from 'react'
import { useQuery } from '@apollo/client'
import { CREATING_POLICY_SLUG, GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import { useUser } from '../../lib/hooks'
import { FilterContext } from '../context/FilterContext'
import { PROJECT_POLICY_QUERY } from '../shared/query/project'
import TabNav from '../shared/TabNav'
import { asyncExport, convertKeys, ExportType } from '../utils/export'

const ProjectTabNav = ({ activeTab, setActiveTab }) => {
  const { user } = useUser()

  const [tabNames, setTabNames] = useState([
    'ui.project.header',
    'ui.project.whatIs'
  ])

  useQuery(PROJECT_POLICY_QUERY, {
    variables: { slug: CREATING_POLICY_SLUG },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.CREATING
      }
    },
    onCompleted: () => {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.project.createNew'),
        'ui.project.createNew'
      ])
    }
  })

  const activeFilters = useContext(FilterContext)

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
      {...{ tabNames, activeTab, setActiveTab }}
      exportCsvFn={exportCsvFn}
      exportJsonFn={exportJsonFn}
    />
  )
}

export default ProjectTabNav
