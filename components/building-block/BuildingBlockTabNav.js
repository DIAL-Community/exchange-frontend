import { useContext, useState } from 'react'
import { useQuery } from '@apollo/client'
import { CREATING_POLICY_SLUG, GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import { useUser } from '../../lib/hooks'
import { FilterContext } from '../context/FilterContext'
import { BUILDING_BLOCK_POLICY_QUERY } from '../shared/query/buildingBlock'
import TabNav from '../shared/TabNav'
import { asyncExport, convertKeys, ExportType } from '../utils/export'

const BuildingBlockTabNav = ({ activeTab, setActiveTab }) => {
  const { user } = useUser()

  const activeFilters = useContext(FilterContext)

  const [tabNames, setTabNames] = useState([
    'ui.buildingBlock.header'
  ])

  useQuery(BUILDING_BLOCK_POLICY_QUERY, {
    variables: { slug: CREATING_POLICY_SLUG },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.CREATING
      }
    },
    onCompleted: () => {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.buildingBlock.createNew'),
        'ui.buildingBlock.createNew'
      ])
    }
  })

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
