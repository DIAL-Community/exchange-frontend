import React, { createContext, useState } from 'react'

const BuildingBlockFilterContext = createContext()
const BuildingBlockFilterDispatchContext = createContext()

function BuildingBlockFilterProvider({ children }) {
  const [showMature, setShowMature] = useState(false)
  const [sdgs, setSDGs] = useState([])
  const [useCases, setUseCases] = useState([])
  const [workflows, setWorkflows] = useState([])

  const buildingBlockFilterValues = {
    showMature, sdgs, useCases, workflows
  }
  const buildingBlockFilterDispatchValues = {
    setShowMature,
    setSDGs,
    setUseCases,
    setWorkflows
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
