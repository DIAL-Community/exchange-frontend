import { createContext, useState } from 'react'

export const convertToKey = (s) => s.replace(/\s+/g, '_').toLowerCase()
const FilterResultContext = createContext()

const initialCounts = (() => {
  const filterItems = [
    'filter.entity.sdgs', 'filter.entity.useCases', 'filter.entity.workflows', 'filter.entity.buildingBlocks', 'filter.entity.products',
    'filter.entity.projects', 'filter.entity.organizations', 'filter.entity.maps'
  ]

  return filterItems.reduce((map, item) => {
    map[item] = item === 'maps' ? '3' : '--'
    return map
  }, {})
})()

const FilterResultContextProvider = ({ children }) => {
  const [resultCounts, setResultCounts] = useState(initialCounts)

  return (
    <FilterResultContext.Provider value={{ ...{ resultCounts, setResultCounts } }}>
      {children}
    </FilterResultContext.Provider>
  )
}

export { FilterResultContextProvider, FilterResultContext }
