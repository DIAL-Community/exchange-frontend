import React, { createContext, useState } from 'react'

const UseCaseFilterContext = createContext()
const UseCaseFilterDispatchContext = createContext()

const UseCaseFilterProvider = ({ children }) => {
  const [showBeta, setShowBeta] = useState(false)
  const [sectors, setSectors] = useState([])
  const [sdgs, setSDGs] = useState([])

  const [search, setSearch] = useState('')
  const [displayType, setDisplayType] = useState('card')
  const [sortColumn, setSortColumn] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')

  const useCaseFilterValues = {
    showBeta, sectors, sdgs, search, displayType, sortColumn, sortDirection
  }
  const useCaseFilterDispatchValues = {
    setShowBeta,
    setSectors,
    setSDGs,
    setSearch,
    setDisplayType,
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
