import React, { createContext, useState } from 'react'

const OrganizationFilterContext = createContext()
const OrganizationFilterDispatchContext = createContext()

const OrganizationFilterProvider = ({ children }) => {
  const [aggregator, setAggregator] = useState(false)
  const [endorser, setEndorser] = useState(false)
  const [years, setYears] = useState([])
  const [countries, setCountries] = useState([])
  const [sectors, setSectors] = useState([])

  const [search, setSearch] = useState('')
  const [displayType, setDisplayType] = useState('card')
  const [sortColumn, setSortColumn] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')

  const organizationFilterValues = {
    aggregator, endorser, years, countries, sectors, search, displayType, sortColumn, sortDirection
  }
  const organizationFilterDispatchValues = {
    setAggregator,
    setEndorser,
    setYears,
    setCountries,
    setSectors,
    setSearch,
    setDisplayType,
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
