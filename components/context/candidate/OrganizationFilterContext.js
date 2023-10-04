import { createContext, useState } from 'react'

const OrganizationFilterContext = createContext()
const OrganizationFilterDispatchContext = createContext()

const OrganizationFilterProvider = ({ children }) => {
  const [search, setSearch] = useState('')

  const [pageNumber, setPageNumber] = useState(0)
  const [pageOffset, setPageOffset] = useState(0)

  const candidateOrganizationFilterValues = {
    search,
    pageOffset,
    pageNumber
  }

  const candidateOrganizationFilterDispatchValues = {
    setSearch,
    setPageNumber,
    setPageOffset
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
