import { createContext, useState } from 'react'

const PlayFilterContext = createContext()
const PlayFilterDispatchContext = createContext()

const PlayFilterProvider = ({ children }) => {
  const [tags, setTags] = useState([])
  const [search, setSearch] = useState('')
  const [products, setProducts] = useState([])

  const [pageNumber, setPageNumber] = useState(0)
  const [pageOffset, setPageOffset] = useState(0)

  const playbookFilterValues = {
    tags,
    search,
    products,
    pageOffset,
    pageNumber
  }

  const playbookFilterDispatchValues = {
    setTags,
    setSearch,
    setProducts,
    setPageNumber,
    setPageOffset
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
