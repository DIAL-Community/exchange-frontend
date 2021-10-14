import React, { createContext, useState } from 'react'

const PlayFilterContext = createContext()
const PlayFilterDispatchContext = createContext()

const PlayFilterProvider = ({ children }) => {
  const [products, setProducts] = useState([])

  const [search, setSearch] = useState('')
  const [sortColumn, setSortColumn] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')

  const playbookFilterValues = {
    products,
    search,
    sortColumn,
    sortDirection
  }
  const playbookFilterDispatchValues = {
    setProducts,
    setSearch,
    setSortColumn,
    setSortDirection
  }

  return (
    <PlayFilterContext.Provider value={playbookFilterValues}>
      <PlayFilterDispatchContext.Provider value={playbookFilterDispatchValues}>
        {children}
      </PlayFilterDispatchContext.Provider>
    </PlayFilterContext.Provider>
  )
}

export { PlayFilterProvider, PlayFilterContext, PlayFilterDispatchContext }
