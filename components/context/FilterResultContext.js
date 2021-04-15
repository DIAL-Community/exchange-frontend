import { createContext, useState } from 'react'

export const convertToKey = (s) => s.replace(/\s+/g, '-').toLowerCase()
const FilterResultContext = createContext()

const initialCounts = (() => {
  const filterItems = [
    'SDGs', 'Use Cases', 'Workflows', 'Building Blocks', 'Products', 'Projects',
    'Organizations', 'Map Views'
  ]

  return filterItems.reduce((map, item) => {
    map[convertToKey(item)] = '--'
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
