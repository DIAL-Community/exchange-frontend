import { createContext, useState } from 'react'

const DatasetFilterContext = createContext()
const DatasetFilterDispatchContext = createContext()

const DatasetFilterProvider = ({ children }) => {
  const [search, setSearch] = useState('')

  const [pageNumber, setPageNumber] = useState(0)
  const [pageOffset, setPageOffset] = useState(0)

  const candidateDatasetFilterValues = {
    search,
    pageOffset,
    pageNumber
  }

  const candidateDatasetFilterDispatchValues = {
    setSearch,
    setPageNumber,
    setPageOffset
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
