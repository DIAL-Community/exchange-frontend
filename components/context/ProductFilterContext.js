import React, { createContext, useState } from 'react'

const ProductFilterContext = createContext()
const ProductFilterDispatchContext = createContext()

const ProductFilterProvider = ({ children }) => {
  const [isEndorsed, setIsEndorsed] = useState(false)
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
  const [endorsers, setEndorsers] = useState([])
  const [licenseTypes, setLicenseTypes] = useState([])
  const [isLinkedWithDpi, setIsLinkedWithDpi] = useState(false)

  const [search, setSearch] = useState('')
  const [sortColumn, setSortColumn] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')

  const setSdgs = setSDGs

  const productFilterValues = {
    isEndorsed,
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
    endorsers,
    licenseTypes,
    isLinkedWithDpi,
    search,
    sortColumn,
    sortDirection
  }
  const productFilterDispatchValues = {
    setIsEndorsed,
    setProductDeployable,
    setOrigins,
    setCountries,
    setSectors,
    setOrganizations,
    setSDGs,
    setSdgs,
    setTags,
    setUseCases,
    setWorkflows,
    setBuildingBlocks,
    setEndorsers,
    setLicenseTypes,
    setIsLinkedWithDpi,
    setSearch,
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
