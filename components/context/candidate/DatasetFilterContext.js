import { createContext, useState } from 'react'

const DatasetFilterContext = createContext()
const DatasetFilterDispatchContext = createContext()

const DatasetFilterProvider = ({ children }) => {
  const [search, setSearch] = useState('')

  const candidateDatasetFilterValues = {
    search
  }

  const candidateDatasetFilterDispatchValues = {
    setSearch
  }

  return (
    <DatasetFilterContext.Provider value={candidateDatasetFilterValues}>
      <DatasetFilterDispatchContext.Provider value={candidateDatasetFilterDispatchValues}>
        {children}
      </DatasetFilterDispatchContext.Provider>
    </DatasetFilterContext.Provider>
  )
}

export { DatasetFilterProvider, DatasetFilterContext, DatasetFilterDispatchContext }
