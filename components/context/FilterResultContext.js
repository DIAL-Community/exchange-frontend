import { createContext, useState } from 'react'

export const convertToKey = (s) => s.replace(/\s+/g, '_').toLowerCase()
const FilterResultContext = createContext()

const initialCounts = (() => {
  const filterItems = [
    'SDGs', 'Use Cases', 'Workflows', 'Building Blocks', 'Products', 'Projects',
    'Organizations', 'Maps'
  ]

  return filterItems.reduce((map, item) => {
    const key = convertToKey(item)
    map[key] = key === 'maps' ? '3' : '--'
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
