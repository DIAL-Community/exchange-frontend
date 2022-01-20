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

  const [search, setSearch] = useState('')
  const [sortColumn, setSortColumn] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')

  const organizationFilterValues = {
    aggregator, endorser, endorserLevel, years, countries, sectors, search, sortColumn, sortDirection
  }
  const organizationFilterDispatchValues = {
    setAggregator,
    setEndorser,
    setEndorserLevel,
    setYears,
    setCountries,
    setSectors,
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
