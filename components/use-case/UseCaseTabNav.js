import { useContext, useEffect, useState } from 'react'
import { useUser } from '../../lib/hooks'
import { UseCaseFilterContext } from '../context/UseCaseFilterContext'
import TabNav from '../shared/TabNav'
import { asyncExport, convertKeys, ExportType } from '../utils/export'

const UseCaseTabNav = ({ activeTab, setActiveTab }) => {
  const { user } = useUser()

  const [tabNames, setTabNames] = useState([
    'ui.useCase.header',
    'ui.useCase.whatIs'
  ])

  useEffect(() => {
    if (user?.isAdminUser || user?.isEditorUser) {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.useCase.createNew'),
        'ui.useCase.createNew'
      ])
    }
  }, [user])

  const activeFilters = useContext(UseCaseFilterContext)

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
      { ...{ tabNames, activeTab, setActiveTab }}
      exportCsvFn={exportCsvFn}
      exportJsonFn={exportJsonFn}
    />
  )
}

export default UseCaseTabNav
