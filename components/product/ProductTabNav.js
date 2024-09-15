import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useUser } from '../../lib/hooks'
import { ProductFilterContext } from '../context/ProductFilterContext'
import TabNav from '../shared/TabNav'
import { asyncExport, convertKeys, ExportType } from '../utils/export'

const ProductTabNav = ({ activeTab, setActiveTab }) => {
  const { user } = useUser()
  const router = useRouter()

  const [tabNames, setTabNames] = useState([
    'ui.product.header',
    'ui.product.whatIs'
  ])

  useEffect(() => {
    if (user?.isAdminUser || user?.isEditorUser) {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.product.createNew'),
        'ui.product.createNew'
      ])
    }
  }, [user])

  const activeFilters = useContext(ProductFilterContext)

  const exportCsvFn = () => {
    const productFilters = generateExportFilters(activeFilters)
    const exportParameters = convertKeys({ pageSize: -1, ...productFilters })
    asyncExport(ExportType.EXPORT_AS_CSV, 'products', exportParameters, user.userEmail)
  }

  const exportJsonFn = () => {
    console.log('Active filters: ', activeFilters)
    const productFilters = generateExportFilters(activeFilters)
    const exportParameters = convertKeys({ pageSize: -1, ...productFilters })
    asyncExport(ExportType.EXPORT_AS_JSON, 'products', exportParameters, user.userEmail)
  }

  const generateExportFilters = (activeFilters) => {
    return Object
      .keys(activeFilters)
      .filter(key => {
        return [
          'search',
          'buildingBlocks',
          'countries',
          'isLinkedWithDpi',
          'licenseTypes',
          'origins',
          'sdgs',
          'sectors',
          'showGovStackOnly',
          'showDpgaOnly',
          'tags',
          'useCases',
          'workflows'
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

  const createCandidateFn = () => {
    router.push('/candidate/products/create')
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

export default ProductTabNav
