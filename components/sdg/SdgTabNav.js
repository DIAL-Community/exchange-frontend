import { useState } from 'react'
import TabNav from '../shared/TabNav'

const SdgTabNav = ({ activeTab, setActiveTab }) => {

  const [tabNames] = useState([
    'ui.sdg.header'
  ])

  return <TabNav { ...{ tabNames, activeTab, setActiveTab }} />
}

export default SdgTabNav
