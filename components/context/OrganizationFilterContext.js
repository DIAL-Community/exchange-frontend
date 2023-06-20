import React, { createContext, useState } from 'react'

const OrganizationFilterContext = createContext()
const OrganizationFilterDispatchContext = createContext()

const OrganizationFilterProvider = ({ children }) => {
  const [aggregator, setAggregator] = useState(false)
  const [endorser, setEndorser] = useState(false)
  const [endorserLevel, setEndorserLevel] = useState('')
  const [years, setYears] = useState([])
  const [countries, setCountries] = useState([])
  const [sectors, setSectors] = useState([])

  const [specialties, setSpecialties] = useState([])
  const [certifications, setCertifications] = useState([])
  const [buildingBlocks, setBuildingBlocks] = useState([])

  const [search, setSearch] = useState('')
  const [sortColumn, setSortColumn] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')

  const organizationFilterValues = {
    aggregator,
    endorser,
    endorserLevel,
    years,
    countries,
    sectors,
    specialties,
    certifications,
    buildingBlocks,
    search,
    sortColumn,
    sortDirection
  }

  const organizationFilterDispatchValues = {
    setAggregator,
    setEndorser,
    setEndorserLevel,
    setYears,
    setCountries,
    setSectors,
    setSpecialties,
    setCertifications,
    setBuildingBlocks,
    setSearch,
    setSortColumn,
    setSortDirection
  }

  return (
    <OrganizationFilterContext.Provider value={organizationFilterValues}>
      <OrganizationFilterDispatchContext.Provider value={organizationFilterDispatchValues}>
        {children}
      </OrganizationFilterDispatchContext.Provider>
    </OrganizationFilterContext.Provider>
  )
}

export { OrganizationFilterProvider, OrganizationFilterContext, OrganizationFilterDispatchContext }
