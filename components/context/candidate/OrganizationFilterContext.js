import React, { createContext, useState } from 'react'

const OrganizationFilterContext = createContext()
const OrganizationFilterDispatchContext = createContext()

const OrganizationFilterProvider = ({ children }) => {
  const [search, setSearch] = useState('')

  const candidateOrganizationFilterValues = {
    search
  }
  const candidateOrganizationFilterDispatchValues = {
    setSearch
  }

  return (
    <OrganizationFilterContext.Provider value={candidateOrganizationFilterValues}>
      <OrganizationFilterDispatchContext.Provider value={candidateOrganizationFilterDispatchValues}>
        {children}
      </OrganizationFilterDispatchContext.Provider>
    </OrganizationFilterContext.Provider>
  )
}

export { OrganizationFilterProvider, OrganizationFilterContext, OrganizationFilterDispatchContext }
