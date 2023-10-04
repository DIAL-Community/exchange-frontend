import { createContext, useState } from 'react'

const WorkflowFilterContext = createContext()
const WorkflowFilterDispatchContext = createContext()

const WorkflowFilterProvider = ({ children }) => {
  const [sdgs, setSdgs] = useState([])
  const [useCases, setUseCases] = useState([])

  const [search, setSearch] = useState('')

  const workflowFilterValues = {
    sdgs,
    useCases,
    search
  }

  const workflowFilterDispatchValues = {
    setSdgs,
    setUseCases,
    setSearch
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
