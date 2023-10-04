import { createContext, useState } from 'react'

const PlayFilterContext = createContext()
const PlayFilterDispatchContext = createContext()

const PlayFilterProvider = ({ children }) => {
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
    <PlayFilterContext.Provider value={playbookFilterValues}>
      <PlayFilterDispatchContext.Provider value={playbookFilterDispatchValues}>
        {children}
      </PlayFilterDispatchContext.Provider>
    </PlayFilterContext.Provider>
  )
}

export { PlayFilterProvider, PlayFilterContext, PlayFilterDispatchContext }
