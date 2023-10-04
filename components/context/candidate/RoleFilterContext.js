import { createContext, useState } from 'react'

const RoleFilterContext = createContext()
const RoleFilterDispatchContext = createContext()

const RoleFilterProvider = ({ children }) => {
  const [search, setSearch] = useState('')

  const candidateRoleFilterValues = {
    search
  }

  const candidateRoleFilterDispatchValues = {
    setSearch
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
