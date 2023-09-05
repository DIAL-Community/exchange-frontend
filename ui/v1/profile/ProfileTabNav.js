import { useState } from 'react'
import TabNav from '../shared/TabNav'

const ProfileTabNav = ({ activeTab, setActiveTab }) => {
  const [tabNames] = useState([
    'ui.profile.label',
    'ui.profile.bookmark'
  ])

  return (
    <TabNav
      { ...{ tabNames, activeTab, setActiveTab }}
      exportCsvFn={false}
      exportJsonFn={false}
    />
  )
}

export default ProfileTabNav
