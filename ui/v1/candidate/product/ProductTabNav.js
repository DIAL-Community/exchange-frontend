import { useContext, useEffect, useState } from 'react'
import { ProductFilterContext } from '../../../../components/context/ProductFilterContext'
import TabNav from '../../shared/TabNav'
import { ExportType, asyncExport, convertKeys } from '../../utils/export'
import { useUser } from '../../../../lib/hooks'

const ProductTabNav = ({ activeTab, setActiveTab }) => {
  const { user } = useUser()

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

  return (
    <TabNav
      { ...{ tabNames, activeTab, setActiveTab }}
      exportCsvFn={exportCsvFn}
      exportJsonFn={exportJsonFn}
    />
  )
}

export default ProductTabNav
