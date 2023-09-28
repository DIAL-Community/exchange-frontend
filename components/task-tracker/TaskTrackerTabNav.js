import { useState } from 'react'
import TabNav from '../shared/TabNav'

const TaskTrackerTabNav = ({ activeTab, setActiveTab }) => {
  const [tabNames] = useState([
    'ui.taskTracker.header',
    'ui.taskTracker.whatIs'
  ])

  return <TabNav { ...{ tabNames, activeTab, setActiveTab }} />
}

export default TaskTrackerTabNav
