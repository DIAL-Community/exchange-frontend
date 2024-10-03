import { createContext, useState } from 'react'

const MapFilterContext = createContext()
const MapFilterDispatchContext = createContext()

const MapFilterContextProvider = ({ children }) => {
  const [aggregators, setAggregators] = useState([])
  const [operators, setOperators] = useState([])
  const [services, setServices] = useState([])

  const [orgSectors, setOrgSectors] = useState([])
  const [years, setYears] = useState([])

  const [sectors, setSectors] = useState([])
  const [products, setProducts] = useState([])
  const [tags, setTags] = useState([])
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')

  const mapFilterValues = {
    aggregators,
    operators,
    services,
    orgSectors,
    years,
    sectors,
    products,
    tags,
    countries,
    search
  }

  const mapFilterDispatchValues = {
    setAggregators,
    setOperators,
    setServices,
    setOrgSectors,
    setYears,
    setSectors,
    setProducts,
    setTags,
    setCountries,
    setSearch
  }

  return (
    <MapFilterContext.Provider value={mapFilterValues}>
      <MapFilterDispatchContext.Provider value={mapFilterDispatchValues}>
        {children}
      </MapFilterDispatchContext.Provider>
    </MapFilterContext.Provider>
  )
}

export { MapFilterContextProvider, MapFilterContext, MapFilterDispatchContext }
