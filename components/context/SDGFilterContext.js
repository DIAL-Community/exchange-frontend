import React, { createContext, useState } from 'react'

const SDGFilterContext = createContext()
const SDGFilterDispatchContext = createContext()

const SDGFilterProvider = ({ children }) => {
  const [search, setSearch] = useState('')
  const [sortColumn, setSortColumn] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')

  const sdgFilterValues = { search, sortColumn, sortDirection }
  const sdgFilterDispatchValues = {
    setSearch,
    setSortColumn,
    setSortDirection
  }

  return (
    <SDGFilterContext.Provider value={sdgFilterValues}>
      <SDGFilterDispatchContext.Provider value={sdgFilterDispatchValues}>
        {children}
      </SDGFilterDispatchContext.Provider>
    </SDGFilterContext.Provider>
  )
}

export {
  SDGFilterProvider,
  SDGFilterContext,
  SDGFilterDispatchContext
}
