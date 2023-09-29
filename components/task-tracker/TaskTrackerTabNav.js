import { useState } from 'react'
import TabNav from '../shared/TabNav'

const TaskTrackerTabNav = () => {
  const [tabNames] = useState(['ui.taskTracker.header'])

  return <TabNav { ...{ tabNames }} />
}

export default TaskTrackerTabNav
