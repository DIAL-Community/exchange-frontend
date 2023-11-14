import { createContext, useState } from 'react'

const OpportunityFilterContext = createContext()
const OpportunityFilterDispatchContext = createContext()

const OpportunityFilterProvider = ({ children }) => {
  const [buildingBlocks, setBuildingBlocks] = useState([])
  const [countries, setCountries] = useState([])
  const [organizations, setOrganizations] = useState([])
  const [sectors, setSectors] = useState([])
  const [tags, setTags] = useState([])
  const [useCases, setUseCases] = useState([])
  const [showClosed, setShowClosed] = useState(false)
  const [showGovStackOnly, setShowGovStackOnly] = useState(false)

  const [search, setSearch] = useState('')

  const [pageNumber, setPageNumber] = useState(0)
  const [pageOffset, setPageOffset] = useState(0)

  const opportunityFilterValues = {
    buildingBlocks,
    countries,
    organizations,
    sectors,
    tags,
    useCases,
    showClosed,
    showGovStackOnly,
    search,
    pageOffset,
    pageNumber
  }

  const opportunityFilterDispatchValues = {
    setBuildingBlocks,
    setCountries,
    setOrganizations,
    setSectors,
    setTags,
    setUseCases,
    setShowClosed,
    setShowGovStackOnly,
    setSearch,
    setPageNumber,
    setPageOffset
  }

  return (
    <OpportunityFilterContext.Provider value={opportunityFilterValues}>
      <OpportunityFilterDispatchContext.Provider value={opportunityFilterDispatchValues}>
        {children}
      </OpportunityFilterDispatchContext.Provider>
    </OpportunityFilterContext.Provider>
  )
}

export { OpportunityFilterProvider, OpportunityFilterContext, OpportunityFilterDispatchContext }
