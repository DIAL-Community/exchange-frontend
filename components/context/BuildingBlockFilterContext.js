import React, { createContext, useState } from 'react'

const BuildingBlockFilterContext = createContext()
const BuildingBlockFilterDispatchContext = createContext()

const BuildingBlockFilterProvider = ({ children }) => {
  const [showMature, setShowMature] = useState(false)
  const [sdgs, setSDGs] = useState([])
  const [useCases, setUseCases] = useState([])
  const [workflows, setWorkflows] = useState([])

  const [search, setSearch] = useState('')
  const [displayType, setDisplayType] = useState('card')
  const [sortColumn, setSortColumn] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')

  const buildingBlockFilterValues = {
    showMature, sdgs, useCases, workflows, search, displayType, sortColumn, sortDirection
  }
  const buildingBlockFilterDispatchValues = {
    setShowMature,
    setSDGs,
    setUseCases,
    setWorkflows,
    setSearch,
    setDisplayType,
    setSortColumn,
    setSortDirection
  }

  return (
    <BuildingBlockFilterContext.Provider value={buildingBlockFilterValues}>
      <BuildingBlockFilterDispatchContext.Provider value={buildingBlockFilterDispatchValues}>
        {children}
      </BuildingBlockFilterDispatchContext.Provider>
    </BuildingBlockFilterContext.Provider>
  )
}

export { BuildingBlockFilterProvider, BuildingBlockFilterContext, BuildingBlockFilterDispatchContext }
