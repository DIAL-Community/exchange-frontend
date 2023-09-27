import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { ProductFilterContext } from '../context/ProductFilterContext'
import TabNav from '../shared/TabNav'
import { ExportType, asyncExport, convertKeys } from '../utils/export'
import { useUser } from '../../lib/hooks'

const ProductTabNav = ({ activeTab, setActiveTab }) => {
  const { user } = useUser()
  const router = useRouter()

  const [tabNames, setTabNames] = useState([
    'ui.product.header',
    'ui.product.whatIs'
  ])

  useEffect(() => {
    if (user?.isAdminUser) {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.product.createNew'),
        'ui.product.createNew'
      ])
    }
  }, [user])

  const productFilters = useContext(ProductFilterContext)

  const exportCsvFn = () => {
    const exportParameters = convertKeys({ pageSize: -1, ...productFilters })
    asyncExport(ExportType.EXPORT_AS_CSV, 'products', exportParameters, user.userEmail)
  }

  const exportJsonFn = () => {
    const exportParameters = convertKeys({ pageSize: -1, ...productFilters })
    asyncExport(ExportType.EXPORT_AS_JSON, 'products', exportParameters, user.userEmail)
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
