import { useContext, useState } from 'react'
import { useQuery } from '@apollo/client'
import { CREATING_POLICY_SLUG, GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import { useUser } from '../../lib/hooks'
import { FilterContext } from '../context/FilterContext'
import { USE_CASE_POLICY_QUERY } from '../shared/query/useCase'
import TabNav from '../shared/TabNav'
import { asyncExport, convertKeys, ExportType } from '../utils/export'

const UseCaseTabNav = ({ activeTab, setActiveTab }) => {
  const { user } = useUser()

  const [tabNames, setTabNames] = useState([
    'ui.useCase.header'
  ])

  useQuery(USE_CASE_POLICY_QUERY, {
    variables: { slug: CREATING_POLICY_SLUG },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.CREATING
      }
    },
    onCompleted: () => {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.useCase.createNew'),
        'ui.useCase.createNew'
      ])
    }
  })

  const activeFilters = useContext(FilterContext)

  const exportCsvFn = () => {
    const useCaseFilters = generateExportFilters(activeFilters)
    const exportParameters = convertKeys({ pageSize: -1, ...useCaseFilters })
    asyncExport(ExportType.EXPORT_AS_CSV, 'use_cases', exportParameters, user.userEmail)
  }

  const exportJsonFn = () => {
    const useCaseFilters = generateExportFilters(activeFilters)
    const exportParameters = convertKeys({ pageSize: -1, ...useCaseFilters })
    asyncExport(ExportType.EXPORT_AS_JSON, 'use_cases', exportParameters, user.userEmail)
  }

  const generateExportFilters = (activeFilters) => {
    return Object
      .keys(activeFilters)
      .filter(key => {
        return [
          'search',
          'sdgs',
          'showBeta',
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
      {...{ tabNames, activeTab, setActiveTab }}
      exportCsvFn={exportCsvFn}
      exportJsonFn={exportJsonFn}
    />
  )
}

export default UseCaseTabNav
