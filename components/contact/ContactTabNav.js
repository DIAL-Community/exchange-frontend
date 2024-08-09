import { useEffect, useState } from 'react'
import TabNav from '../shared/TabNav'
import { useUser } from '../../lib/hooks'

const ContactTabNav = ({ activeTab, setActiveTab }) => {
  const { user } = useUser()

  const [tabNames, setTabNames] = useState([
    'ui.contact.header'
  ])

  useEffect(() => {
    if (user?.isAdminUser || user?.isEditorUser) {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.contact.createNew'),
        'ui.contact.createNew'
      ])
    }
  }, [user])

  return <TabNav { ...{ tabNames, activeTab, setActiveTab }} />
}

export default ContactTabNav
