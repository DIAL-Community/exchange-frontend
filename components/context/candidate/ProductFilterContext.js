import React, { createContext, useState } from 'react'

const ProductFilterContext = createContext()
const ProductFilterDispatchContext = createContext()

const ProductFilterProvider = ({ children }) => {
  const [search, setSearch] = useState('')

  const candidateProductFilterValues = {
    search
  }
  const candidateProductFilterDispatchValues = {
    setSearch
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
