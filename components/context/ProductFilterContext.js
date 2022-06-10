import React, { createContext, useState } from 'react'

const ProductFilterContext = createContext()
const ProductFilterDispatchContext = createContext()

const ProductFilterProvider = ({ children }) => {
  const [withMaturity, setWithMaturity] = useState(false)
  const [forCovid, setForCovid] = useState(false)
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

  const [search, setSearch] = useState('')
  const [sortColumn, setSortColumn] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')

  const productFilterValues = {
    withMaturity,
    productDeployable,
    forCovid,
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
    search,
    sortColumn,
    sortDirection
  }
  const productFilterDispatchValues = {
    setWithMaturity,
    setProductDeployable,
    setForCovid,
    setOrigins,
    setCountries,
    setSectors,
    setOrganizations,
    setSDGs,
    setTags,
    setUseCases,
    setWorkflows,
    setBuildingBlocks,
    setEndorsers,
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
