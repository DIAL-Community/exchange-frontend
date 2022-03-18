import React, { createContext, useState } from 'react'

const UserFilterContext = createContext()
const UserFilterDispatchContext = createContext()

const UserFilterProvider = ({ children }) => {
  const [search, setSearch] = useState('')
  const [sortColumn, setSortColumn] = useState('email')
  const [sortDirection, setSortDirection] = useState('asc')

  const UserFilterValues = {
    search, sortColumn, sortDirection
  }
  const UserFilterDispatchValues = {
    setSearch,
    setSortColumn,
    setSortDirection
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
