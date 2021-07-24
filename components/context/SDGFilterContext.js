import React, { createContext, useState } from 'react'

const SDGFilterContext = createContext()
const SDGFilterDispatchContext = createContext()

const SDGFilterProvider = ({ children }) => {
  const [sdgs, setSDGs] = useState([])

  const [search, setSearch] = useState('')
  const [sortColumn, setSortColumn] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')

  const sdgFilterValues = { sdgs, search, sortColumn, sortDirection }
  const sdgFilterDispatchValues = {
    setSDGs,
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

export { SDGFilterProvider, SDGFilterContext, SDGFilterDispatchContext }
