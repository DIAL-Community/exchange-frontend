import React, { createContext, useState } from 'react'

const OrganizationFilterContext = createContext()
const OrganizationFilterDispatchContext = createContext()

function OrganizationFilterProvider ({ children }) {
  const [aggregator, setAggregator] = useState(false)
  const [endorser, setEndorser] = useState(false)
  const [years, setYears] = useState([])
  const [countries, setCountries] = useState([])
  const [sectors, setSectors] = useState([])

  const organizationFilterValues = {
    aggregator, endorser, years, countries, sectors
  }
  const organizationFilterDispatchValues = {
    setAggregator,
    setEndorser,
    setYears,
    setCountries,
    setSectors
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
