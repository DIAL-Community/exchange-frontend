import { createContext, useState } from 'react'

const MapFilterContext = createContext()
const MapFilterDispatchContext = createContext()

const MapFilterContextProvider = ({ children }) => {
  const [aggregators, setAggregators] = useState([])
  const [operators, setOperators] = useState([])
  const [services, setServices] = useState([])

  const [years, setYears] = useState([])

  const [sectors, setSectors] = useState([])
  const [products, setProducts] = useState([])
  const [tags, setTags] = useState([])
  const [search, setSearch] = useState('')

  const mapFilterValues = {
    aggregators,
    operators,
    services,
    years,
    sectors,
    products,
    tags,
    search
  }

  const mapFilterDispatchValues = {
    setAggregators,
    setOperators,
    setServices,
    setYears,
    setSectors,
    setProducts,
    setTags,
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
