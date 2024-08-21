import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useUser } from '../../lib/hooks'
import TabNav from '../shared/TabNav'

const StorefrontTabNav = ({ activeTab, setActiveTab }) => {
  const { user } = useUser()
  const router = useRouter()

  const [tabNames, setTabNames] = useState([
    'ui.storefront.header',
    'ui.storefront.whatIs'
  ])

  useEffect(() => {
    if (user?.isAdminUser || user?.isEditorUser) {
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
