import React, { createContext, useState } from 'react'

const ProductFilterContext = createContext()
const ProductFilterDispatchContext = createContext()

function ProductFilterProvider ({ children }) {
  const [withMaturity, setWithMaturity] = useState(false)
  const [productDeployable, setProductDeployable] = useState(false)
  const [origins, setOrigins] = useState([])
  const [countries, setCountries] = useState([])
  const [sectors, setSectors] = useState([])
  const [organizations, setOrganizations] = useState([])
  const [sdgs, setSDGs] = useState([])
  const [useCases, setUseCases] = useState([])
  const [workflows, setWorkflows] = useState([])
  const [buildingBlocks, setBuildingBlocks] = useState([])
  const [productTypes, setProductTypes] = useState([])

  const productFilterValues = {
    withMaturity, productDeployable, origins, countries, sectors, organizations, sdgs, useCases, workflows, buildingBlocks, productTypes
  }
  const productFilterDispatchValues = {
    setWithMaturity,
    setProductDeployable,
    setOrigins,
    setCountries,
    setSectors,
    setOrganizations,
    setSDGs,
    setUseCases,
    setWorkflows,
    setBuildingBlocks,
    setProductTypes
  }

  return (
    <ProductFilterContext.Provider value={productFilterValues}>
      <ProductFilterDispatchContext.Provider value={productFilterDispatchValues}>
        {children}
      </ProductFilterDispatchContext.Provider>
    </ProductFilterContext.Provider>
  )
}

export { ProductFilterProvider, ProductFilterContext, ProductFilterDispatchContext }
