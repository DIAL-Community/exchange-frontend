import { createContext, useState } from 'react'

const UserFilterContext = createContext()
const UserFilterDispatchContext = createContext()

const UserFilterProvider = ({ children }) => {
  const [search, setSearch] = useState('')

  const [pageNumber, setPageNumber] = useState(0)
  const [pageOffset, setPageOffset] = useState(0)

  const UserFilterValues = {
    search,
    pageOffset,
    pageNumber
  }

  const UserFilterDispatchValues = {
    setSearch,
    setPageNumber,
    setPageOffset
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
