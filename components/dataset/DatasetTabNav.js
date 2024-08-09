import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useUser } from '../../lib/hooks'
import TabNav from '../shared/TabNav'

const DatasetTabNav = ({ activeTab, setActiveTab }) => {
  const { user } = useUser()
  const router = useRouter()

  const [tabNames, setTabNames] = useState([
    'ui.dataset.header',
    'ui.dataset.whatIs'
  ])

  useEffect(() => {
    if (user?.isAdminUser || user?.isEditorUser) {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.dataset.createNew'),
        'ui.dataset.createNew'
      ])
    }
  }, [user])

  const createCandidateFn = () => {
    router.push('/candidate/datasets/create')
  }

  return <TabNav { ...{ tabNames, activeTab, setActiveTab }} createFn={createCandidateFn} />
}

export default DatasetTabNav
