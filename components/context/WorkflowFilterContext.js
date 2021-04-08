import React, { createContext, useState } from 'react'

const WorkflowFilterContext = createContext()
const WorkflowFilterDispatchContext = createContext()

function WorkflowFilterProvider({ children }) {
  const [sdgs, setSDGs] = useState([])
  const [useCases, setUseCases] = useState([])

  const workflowFilterValues = {
    sdgs, useCases
  }
  const workflowFilterDispatchValues = {
    setSDGs,
    setUseCases
  }

  return (
    <WorkflowFilterContext.Provider value={workflowFilterValues}>
      <WorkflowFilterDispatchContext.Provider value={workflowFilterDispatchValues}>
        {children}
      </WorkflowFilterDispatchContext.Provider>
    </WorkflowFilterContext.Provider>
  )
}

export { WorkflowFilterProvider, WorkflowFilterContext, WorkflowFilterDispatchContext }
