import React, { createContext, useState } from 'react'

const BuildingBlockFilterContext = createContext()
const BuildingBlockFilterDispatchContext = createContext()

const BuildingBlockFilterProvider = ({ children }) => {
  const [showMature, setShowMature] = useState(false)
  const [sdgs, setSDGs] = useState([])
  const [useCases, setUseCases] = useState([])
  const [workflows, setWorkflows] = useState([])
  const [categoryTypes, setCategoryTypes] = useState([])

  const [search, setSearch] = useState('')
  const [sortColumn, setSortColumn] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')

  const setSdgs = setSDGs

  const buildingBlockFilterValues = {
    showMature, sdgs, useCases, workflows, categoryTypes, search, sortColumn, sortDirection
  }
  const buildingBlockFilterDispatchValues = {
    setShowMature,
    setSDGs,
    setSdgs,
    setUseCases,
    setWorkflows,
    setCategoryTypes,
    setSearch,
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
