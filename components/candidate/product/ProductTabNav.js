import { useEffect, useState } from 'react'
import TabNav from '../../shared/TabNav'
import { useUser } from '../../../../lib/hooks'

const ProductTabNav = ({ activeTab, setActiveTab }) => {
  const { user } = useUser()

  const [tabNames, setTabNames] = useState([
    'ui.candidateProduct.header'
  ])

  useEffect(() => {
    if (user?.isAdminUser) {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.candidateProduct.createNew'),
        'ui.candidateProduct.createNew'
      ])
    }
  }, [user])

  return <TabNav { ...{ tabNames, activeTab, setActiveTab }} />
}

export default ProductTabNav
