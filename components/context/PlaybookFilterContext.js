import { createContext, useState } from 'react'

const PlaybookFilterContext = createContext()
const PlaybookFilterDispatchContext = createContext()

const PlaybookFilterProvider = ({ children }) => {
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
    <PlaybookFilterContext.Provider value={playbookFilterValues}>
      <PlaybookFilterDispatchContext.Provider value={playbookFilterDispatchValues}>
        {children}
      </PlaybookFilterDispatchContext.Provider>
    </PlaybookFilterContext.Provider>
  )
}

export { PlaybookFilterProvider, PlaybookFilterContext, PlaybookFilterDispatchContext }
