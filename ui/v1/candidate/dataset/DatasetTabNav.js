import { useEffect, useState } from 'react'
import TabNav from '../../shared/TabNav'
import { useUser } from '../../../../lib/hooks'

const DatasetTabNav = ({ activeTab, setActiveTab }) => {
  const { user } = useUser()

  const [tabNames, setTabNames] = useState([
    'ui.candidateDataset.header'
  ])

  useEffect(() => {
    if (user?.isAdminUser) {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.candidateDataset.createNew'),
        'ui.candidateDataset.createNew'
      ])
    }
  }, [user])

  return <TabNav { ...{ tabNames, activeTab, setActiveTab }} />
}

export default DatasetTabNav
