import React, { createContext, useState } from 'react'

const WorkflowFilterContext = createContext()
const WorkflowFilterDispatchContext = createContext()

const WorkflowFilterProvider = ({ children }) => {
  const [sdgs, setSDGs] = useState([])
  const [useCases, setUseCases] = useState([])

  const [search, setSearch] = useState('')
  const [displayType, setDisplayType] = useState('card')
  const [sortColumn, setSortColumn] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')

  const workflowFilterValues = {
    sdgs, useCases, search, displayType, sortColumn, sortDirection
  }
  const workflowFilterDispatchValues = {
    setSDGs,
    setUseCases,
    setSearch,
    setDisplayType,
    setSortColumn,
    setSortDirection
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
