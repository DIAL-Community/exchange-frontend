import { createContext, useState } from 'react'

const PlaybookFilterContext = createContext()
const PlaybookFilterDispatchContext = createContext()

const PlaybookFilterProvider = ({ children }) => {
  const [tags, setTags] = useState([])
  const [search, setSearch] = useState('')
  const [products, setProducts] = useState([])

  const playbookFilterValues = {
    tags,
    search,
    products
  }
  const playbookFilterDispatchValues = {
    setTags,
    setSearch,
    setProducts
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
