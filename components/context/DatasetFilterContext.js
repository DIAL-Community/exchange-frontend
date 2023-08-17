import React, { createContext, useState } from 'react'

const DatasetFilterContext = createContext()
const DatasetFilterDispatchContext = createContext()

const DatasetFilterProvider = ({ children }) => {
  const [origins, setOrigins] = useState([])
  const [countries, setCountries] = useState([])
  const [sectors, setSectors] = useState([])
  const [organizations, setOrganizations] = useState([])
  const [sdgs, setSDGs] = useState([])
  const [tags, setTags] = useState([])
  const [datasetTypes, setDatasetTypes] = useState([])

  const [search, setSearch] = useState('')
  const [sortColumn, setSortColumn] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')

  const setSdgs = setSDGs

  const datasetFilterValues = {
    origins,
    countries,
    sectors,
    organizations,
    sdgs,
    tags,
    datasetTypes,
    search,
    sortColumn,
    sortDirection
  }
  const datasetFilterDispatchValues = {
    setOrigins,
    setCountries,
    setSectors,
    setOrganizations,
    setSDGs,
    setSdgs,
    setTags,
    setDatasetTypes,
    setSearch,
    setSortColumn,
    setSortDirection
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
