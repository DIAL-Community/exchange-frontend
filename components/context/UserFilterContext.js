import { createContext, useState } from 'react'

const UserFilterContext = createContext()
const UserFilterDispatchContext = createContext()

const UserFilterProvider = ({ children }) => {
  const [search, setSearch] = useState('')

  const UserFilterValues = {
    search
  }

  const UserFilterDispatchValues = {
    setSearch
  }

  return (
    <UserFilterContext.Provider value={UserFilterValues}>
      <UserFilterDispatchContext.Provider value={UserFilterDispatchValues}>
        {children}
      </UserFilterDispatchContext.Provider>
    </UserFilterContext.Provider>
  )
}

export { UserFilterProvider, UserFilterContext, UserFilterDispatchContext }
