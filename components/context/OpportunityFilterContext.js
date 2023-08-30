import React, { createContext, useState } from 'react'

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

  const [search, setSearch] = useState('')
  const [sortColumn, setSortColumn] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')

  const opportunityFilterValues = {
    buildingBlocks,
    countries,
    organizations,
    sectors,
    tags,
    useCases,
    showClosed,
    search,
    sortColumn,
    sortDirection
  }
  const opportunityFilterDispatchValues = {
    setBuildingBlocks,
    setCountries,
    setOrganizations,
    setSectors,
    setTags,
    setUseCases,
    setShowClosed,
    setSearch,
    setSortColumn,
    setSortDirection
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
