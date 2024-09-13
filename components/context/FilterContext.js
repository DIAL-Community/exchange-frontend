import { createContext, useState } from 'react'

const FilterContext = createContext()
const FilterDispatchContext = createContext()

const FilterContextProvider = ({ children }) => {
  const [search, setSearch] = useState('')
  // Task tracker context only
  const [showFailedOnly, setShowFailedOnly] = useState(false)
  const [showGovStackOnly, setShowGovStackOnly] = useState(false)
  const [showMature, setShowMature] = useState(false)

  const [categoryTypes, setCategoryTypes] = useState([])
  const [sdgs, setSdgs] = useState([])
  const [useCases, setUseCases] = useState([])
  const [workflows, setWorkflows] = useState([])

  const [origins, setOrigins] = useState([])
  const [countries, setCountries] = useState([])
  const [sectors, setSectors] = useState([])
  const [organizations, setOrganizations] = useState([])
  const [tags, setTags] = useState([])
  const [datasetTypes, setDatasetTypes] = useState([])

  const [aggregators, setAggregators] = useState([])
  const [operators, setOperators] = useState([])
  const [services, setServices] = useState([])

  const [years, setYears] = useState([])

  const [products, setProducts] = useState([])

  const valueProps = {
    search,
    showFailedOnly,
    showGovStackOnly,
    showMature,
    categoryTypes,
    sdgs,
    useCases,
    workflows,

    countries,
    datasetTypes,
    organizations,
    origins,
    sectors,
    tags,

    aggregators,
    operators,
    services,

    years,

    products
  }

  const dispatchProps = {
    setSearch,
    setShowFailedOnly,
    setShowGovStackOnly,
    setShowMature,
    setCategoryTypes,
    setSdgs,
    setUseCases,
    setWorkflows,

    setCountries,
    setDatasetTypes,
    setOrganizations,
    setOrigins,
    setSectors,
    setTags,

    setAggregators,
    setOperators,
    setServices,

    setYears,

    setProducts
  }

  return (
    <FilterContext.Provider value={{ ...valueProps }}>
      <FilterDispatchContext.Provider value={{ ...dispatchProps }}>
        {children}
      </FilterDispatchContext.Provider>
    </FilterContext.Provider>
  )
}

export { FilterContextProvider, FilterContext, FilterDispatchContext }
