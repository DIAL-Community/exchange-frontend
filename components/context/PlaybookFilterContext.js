import React, { createContext, useState } from 'react'

const PlaybookFilterContext = createContext()
const PlaybookFilterDispatchContext = createContext()

const PlaybookFilterProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [tags, setTags] = useState([])
  const [search, setSearch] = useState('')
  const [sortColumn, setSortColumn] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')

  const playbookFilterValues = {
    products,
    tags,
    search,
    sortColumn,
    sortDirection
  }
  const playbookFilterDispatchValues = {
    setProducts,
    setTags,
    setSearch,
    setSortColumn,
    setSortDirection
  }

  return (
    <PlaybookFilterContext.Provider value={playbookFilterValues}>
      <PlaybookFilterDispatchContext.Provider value={playbookFilterDispatchValues}>
        {children}
      </PlaybookFilterDispatchContext.Provider>
    </PlaybookFilterContext.Provider>
  )
}

export { PlaybookFilterProvider, PlaybookFilterContext, PlaybookFilterDispatchContext }
