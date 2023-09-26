import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import TabNav from '../shared/TabNav'
import { useUser } from '../../lib/hooks'

const StorefrontTabNav = ({ activeTab, setActiveTab }) => {
  const { user } = useUser()
  const router = useRouter()

  const [tabNames, setTabNames] = useState([
    'ui.storefront.header',
    'ui.storefront.whatIs'
  ])

  useEffect(() => {
    if (user?.isAdminUser) {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.storefront.createNew'),
        'ui.storefront.createNew'
      ])
    }
  }, [user])

  const createCandidateFn = () => {
    router.push('/storefronts/create')
  }

  return <TabNav { ...{ tabNames, activeTab, setActiveTab }} createFn={createCandidateFn} />
}

export default StorefrontTabNav
