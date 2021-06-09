import React, { createContext, useState } from 'react'

const ProductFilterContext = createContext()
const ProductFilterDispatchContext = createContext()

const ProductFilterProvider = ({ children }) => {
  const [withMaturity, setWithMaturity] = useState(false)
  const [productDeployable, setProductDeployable] = useState(false)
  const [origins, setOrigins] = useState([])
  const [countries, setCountries] = useState([])
  const [sectors, setSectors] = useState([])
  const [organizations, setOrganizations] = useState([])
  const [sdgs, setSDGs] = useState([])
  const [tags, setTags] = useState([])
  const [useCases, setUseCases] = useState([])
  const [workflows, setWorkflows] = useState([])
  const [buildingBlocks, setBuildingBlocks] = useState([])
  const [productTypes, setProductTypes] = useState([])

  const [search, setSearch] = useState('')
  const [displayType, setDisplayType] = useState('card')
  const [sortColumn, setSortColumn] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')

  const productFilterValues = {
    withMaturity,
    productDeployable,
    origins,
    countries,
    sectors,
    organizations,
    sdgs,
    tags,
    useCases,
    workflows,
    buildingBlocks,
    productTypes,
    search,
    displayType,
    sortColumn,
    sortDirection
  }
  const productFilterDispatchValues = {
    setWithMaturity,
    setProductDeployable,
    setOrigins,
    setCountries,
    setSectors,
    setOrganizations,
    setSDGs,
    setTags,
    setUseCases,
    setWorkflows,
    setBuildingBlocks,
    setProductTypes,
    setSearch,
    setDisplayType,
    setSortColumn,
    setSortDirection
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
