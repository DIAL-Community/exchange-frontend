import { useState } from 'react'
import TabNav from '../../shared/TabNav'

const RoleTabNav = ({ activeTab, setActiveTab }) => {
  const [tabNames] = useState([
    'ui.candidateRole.header'
  ])

  return <TabNav { ...{ tabNames, activeTab, setActiveTab }} />
}

export default RoleTabNav
