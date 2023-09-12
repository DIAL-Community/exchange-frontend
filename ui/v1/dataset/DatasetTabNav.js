import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { DatasetFilterContext } from '../../../components/context/DatasetFilterContext'
import TabNav from '../shared/TabNav'
import { ExportType, asyncExport, convertKeys } from '../utils/export'
import { useUser } from '../../../lib/hooks'

const DatasetTabNav = ({ activeTab, setActiveTab }) => {
  const { user } = useUser()
  const router = useRouter()

  const [tabNames, setTabNames] = useState([
    'ui.dataset.header',
    'ui.dataset.whatIs'
  ])

  useEffect(() => {
    if (user?.isAdminUser) {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.dataset.createNew'),
        'ui.dataset.createNew'
      ])
    }
  }, [user])

  const datasetFilters = useContext(DatasetFilterContext)

  const exportCsvFn = () => {
    const exportParameters = convertKeys({ pageSize: -1, ...datasetFilters })
    asyncExport(ExportType.EXPORT_AS_CSV, 'datasets', exportParameters, user.userEmail)
  }

  const exportJsonFn = () => {
    const exportParameters = convertKeys({ pageSize: -1, ...datasetFilters })
    asyncExport(ExportType.EXPORT_AS_JSON, 'datasets', exportParameters, user.userEmail)
  }

  const createCandidateFn = () => {
    router.push('/candidate/datasets/create')
  }

  return (
    <TabNav
      { ...{ tabNames, activeTab, setActiveTab }}
      createFn={createCandidateFn}
      exportCsvFn={exportCsvFn}
      exportJsonFn={exportJsonFn}
    />
  )
}

export default DatasetTabNav
