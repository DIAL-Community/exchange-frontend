import { useState } from 'react'
import TabNav from '../shared/TabNav'

const CityTabNav = ({ activeTab, setActiveTab }) => {
  const [tabNames] = useState([
    'ui.city.header'
  ])

  return <TabNav { ...{ tabNames, activeTab, setActiveTab }} />
}

export default CityTabNav
