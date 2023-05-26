import React, { createContext, useState } from 'react'

const UseCaseFilterContext = createContext()
const UseCaseFilterDispatchContext = createContext()

const UseCaseFilterProvider = ({ children }) => {
  const [showBeta, setShowBeta] = useState(false)
  const [govStackOnly, setShowGovStack] = useState(false)
  const [sectors, setSectors] = useState([])
  const [sdgs, setSDGs] = useState([])

  const [search, setSearch] = useState('')
  const [sortColumn, setSortColumn] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')

  const useCaseFilterValues = {
    showBeta, govStackOnly, sectors, sdgs, search, sortColumn, sortDirection
  }
  const useCaseFilterDispatchValues = {
    setShowBeta,
    setShowGovStack,
    setSectors,
    setSDGs,
    setSearch,
    setSortColumn,
    setSortDirection
  }

  return (
    <UseCaseFilterContext.Provider value={useCaseFilterValues}>
      <UseCaseFilterDispatchContext.Provider value={useCaseFilterDispatchValues}>
        {children}
      </UseCaseFilterDispatchContext.Provider>
    </UseCaseFilterContext.Provider>
  )
}

export { UseCaseFilterProvider, UseCaseFilterContext, UseCaseFilterDispatchContext }
