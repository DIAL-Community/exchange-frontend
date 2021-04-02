import React, { createContext, useState } from 'react';

const ProductFilterContext = createContext()
const ProductFilterDispatchContext = createContext()

function ProductFilterProvider ({ children }) {
  const [withMaturity, setWithMaturity] = useState(false)
  const [origins, setOrigins] = useState([])

  return (
    <ProductFilterContext.Provider value={{ withMaturity, origins }}>
      <ProductFilterDispatchContext.Provider value={{ setWithMaturity, setOrigins }}>
        {children}
      </ProductFilterDispatchContext.Provider>
    </ProductFilterContext.Provider>
  )
}

export { ProductFilterProvider, ProductFilterContext, ProductFilterDispatchContext }
