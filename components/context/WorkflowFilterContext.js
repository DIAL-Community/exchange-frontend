import React, { createContext, useState } from 'react'

const WorkflowFilterContext = createContext()
const WorkflowFilterDispatchContext = createContext()

const WorkflowFilterProvider = ({ children }) => {
  const [sdgs, setSDGs] = useState([])
  const [useCases, setUseCases] = useState([])

  const [search, setSearch] = useState('')
  const [sortColumn, setSortColumn] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')

  const setSdgs = setSDGs

  const workflowFilterValues = {
    sdgs, useCases, search, sortColumn, sortDirection
  }
  const workflowFilterDispatchValues = {
    setSDGs,
    setSdgs,
    setUseCases,
    setSearch,
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
