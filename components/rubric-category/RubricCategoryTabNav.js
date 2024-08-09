import { useEffect, useState } from 'react'
import TabNav from '../shared/TabNav'
import { useUser } from '../../lib/hooks'

const RubricCategoryTabNav = ({ activeTab, setActiveTab }) => {
  const { user } = useUser()

  const [tabNames, setTabNames] = useState([
    'ui.rubricCategory.header'
  ])

  useEffect(() => {
    if (user?.isAdminUser || user?.isEditorUser) {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.rubricCategory.createNew'),
        'ui.rubricCategory.createNew'
      ])
    }
  }, [user])

  return <TabNav { ...{ tabNames, activeTab, setActiveTab }} />
}

export default RubricCategoryTabNav
