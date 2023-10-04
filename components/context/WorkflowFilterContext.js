import { createContext, useState } from 'react'

const WorkflowFilterContext = createContext()
const WorkflowFilterDispatchContext = createContext()

const WorkflowFilterProvider = ({ children }) => {
  const [sdgs, setSdgs] = useState([])
  const [useCases, setUseCases] = useState([])

  const [search, setSearch] = useState('')

  const [pageNumber, setPageNumber] = useState(0)
  const [pageOffset, setPageOffset] = useState(0)

  const workflowFilterValues = {
    sdgs,
    useCases,
    search,
    pageOffset,
    pageNumber
  }

  const workflowFilterDispatchValues = {
    setSdgs,
    setUseCases,
    setSearch,
    setPageNumber,
    setPageOffset
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
