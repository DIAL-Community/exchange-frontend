import { createContext, useState } from 'react'

const BuildingBlockFilterContext = createContext()
const BuildingBlockFilterDispatchContext = createContext()

const BuildingBlockFilterProvider = ({ children }) => {
  const [showMature, setShowMature] = useState(false)
  const [showGovStackOnly, setShowGovStackOnly] = useState(false)
  const [sdgs, setSdgs] = useState([])
  const [useCases, setUseCases] = useState([])
  const [workflows, setWorkflows] = useState([])
  const [categoryTypes, setCategoryTypes] = useState([])

  const [search, setSearch] = useState('')

  const [pageNumber, setPageNumber] = useState(0)
  const [pageOffset, setPageOffset] = useState(0)

  const buildingBlockFilterValues = {
    showMature,
    showGovStackOnly,
    sdgs,
    useCases,
    workflows,
    categoryTypes,
    search,
    pageOffset,
    pageNumber
  }
  const buildingBlockFilterDispatchValues = {
    setShowMature,
    setShowGovStackOnly,
    setSdgs,
    setUseCases,
    setWorkflows,
    setCategoryTypes,
    setSearch,
    setPageNumber,
    setPageOffset
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
