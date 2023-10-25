import { createContext, useState } from 'react'

const ProductFilterContext = createContext()
const ProductFilterDispatchContext = createContext()

const ProductFilterProvider = ({ children }) => {
  const [search, setSearch] = useState('')

  const [pageNumber, setPageNumber] = useState(0)
  const [pageOffset, setPageOffset] = useState(0)

  const candidateProductFilterValues = {
    search,
    pageOffset,
    pageNumber
  }

  const candidateProductFilterDispatchValues = {
    setSearch,
    setPageNumber,
    setPageOffset
  }

  return (
    <ProductFilterContext.Provider value={candidateProductFilterValues}>
      <ProductFilterDispatchContext.Provider value={candidateProductFilterDispatchValues}>
        {children}
      </ProductFilterDispatchContext.Provider>
    </ProductFilterContext.Provider>
  )
}

export { ProductFilterProvider, ProductFilterContext, ProductFilterDispatchContext }
