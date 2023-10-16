import { createContext, useState } from 'react'

const DatasetFilterContext = createContext()
const DatasetFilterDispatchContext = createContext()

const DatasetFilterProvider = ({ children }) => {
  const [origins, setOrigins] = useState([])
  const [countries, setCountries] = useState([])
  const [sectors, setSectors] = useState([])
  const [organizations, setOrganizations] = useState([])
  const [sdgs, setSdgs] = useState([])
  const [tags, setTags] = useState([])
  const [datasetTypes, setDatasetTypes] = useState([])

  const [search, setSearch] = useState('')

  const [pageNumber, setPageNumber] = useState(0)
  const [pageOffset, setPageOffset] = useState(0)

  const datasetFilterValues = {
    origins,
    countries,
    sectors,
    organizations,
    sdgs,
    tags,
    datasetTypes,
    search,
    pageOffset,
    pageNumber
  }
  const datasetFilterDispatchValues = {
    setOrigins,
    setCountries,
    setSectors,
    setOrganizations,
    setSdgs,
    setTags,
    setDatasetTypes,
    setSearch,
    setPageNumber,
    setPageOffset
  }

  return (
    <DatasetFilterContext.Provider value={datasetFilterValues}>
      <DatasetFilterDispatchContext.Provider value={datasetFilterDispatchValues}>
        {children}
      </DatasetFilterDispatchContext.Provider>
    </DatasetFilterContext.Provider>
  )
}

export { DatasetFilterProvider, DatasetFilterContext, DatasetFilterDispatchContext }
