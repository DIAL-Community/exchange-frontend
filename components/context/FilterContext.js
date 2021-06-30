import { createContext, useState } from 'react'

export const convertToKey = (s) => s.replace(/\s+/g, '_').toLowerCase()
const FilterContext = createContext()

const initialCounts = (() => {
  const filterItems = [
    'filter.entity.sdgs', 'filter.entity.useCases', 'filter.entity.workflows', 'filter.entity.buildingBlocks',
    'filter.entity.products', 'filter.entity.projects', 'filter.entity.organizations', 'filter.entity.maps'
  ]

  return filterItems.reduce((map, item) => {
    map[item] = item === 'maps' ? '3' : '--'
    return map
  }, {})
})()

const FilterContextProvider = ({ children }) => {
  const [resultCounts, setResultCounts] = useState(initialCounts)
  const [displayType, setDisplayType] = useState('card')
  const [openFilter, setOpenFilter] = useState(false)

  const props = { resultCounts, displayType, openFilter, setResultCounts, setDisplayType, setOpenFilter }

  return (
    <FilterContext.Provider value={{ ...props }}>
      {children}
    </FilterContext.Provider>
  )
}

export { FilterContextProvider, FilterContext }
