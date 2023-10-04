import { createContext, useState } from 'react'

const RoleFilterContext = createContext()
const RoleFilterDispatchContext = createContext()

const RoleFilterProvider = ({ children }) => {
  const [search, setSearch] = useState('')

  const [pageNumber, setPageNumber] = useState(0)
  const [pageOffset, setPageOffset] = useState(0)

  const candidateRoleFilterValues = {
    search,
    pageOffset,
    pageNumber
  }

  const candidateRoleFilterDispatchValues = {
    setSearch,
    setPageNumber,
    setPageOffset
  }

  return (
    <RoleFilterContext.Provider value={candidateRoleFilterValues}>
      <RoleFilterDispatchContext.Provider value={candidateRoleFilterDispatchValues}>
        {children}
      </RoleFilterDispatchContext.Provider>
    </RoleFilterContext.Provider>
  )
}

export { RoleFilterProvider, RoleFilterContext, RoleFilterDispatchContext }
