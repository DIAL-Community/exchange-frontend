import { createContext, useState } from 'react'

export const convertToKey = (s) => s.replace(/\s+/g, '_').toLowerCase()
export const FILTER_ITEMS = [ 'filter.entity.organizations' ]

const FilterContext = createContext()
const initialCounts = (() => {
  return FILTER_ITEMS.reduce((map, item) => {
    map[item] = item === 'filter.entity.maps' ? '3' : '0'

    return map
  }, {})
})()

const FilterContextProvider = ({ children }) => {
  const [search, setSearch] = useState('')
  const [resultCounts, setResultCounts] = useState(initialCounts)
  // Task tracker context only
  const [showFailedOnly, setShowFailedOnly] = useState(false)

  const props = {
    search,
    resultCounts,
    showFailedOnly,
    setSearch,
    setResultCounts,
    setShowFailedOnly
  }

  return (
    <FilterContext.Provider value={{ ...props }}>
      {children}
    </FilterContext.Provider>
  )
}

export { FilterContextProvider, FilterContext }
