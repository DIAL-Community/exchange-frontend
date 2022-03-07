import { createContext, useState } from 'react'

export const convertToKey = (s) => s.replace(/\s+/g, '_').toLowerCase()
const FilterContext = createContext()

export const FILTER_ITEMS = [
  'filter.entity.sdgs', 'filter.entity.useCases', 'filter.entity.workflows', 'filter.entity.buildingBlocks',
  'filter.entity.products', 'filter.entity.projects', 'filter.entity.organizations', // 'filter.entity.playbooks',
  'filter.entity.maps'
]

export const MAPPED_FILTER_ITEMS_URL = {
  'filter.entity.sdgs': 'sdgs',
  'filter.entity.useCases': 'use_cases',
  'filter.entity.workflows': 'workflows',
  'filter.entity.buildingBlocks': 'building_blocks',
  'filter.entity.products': 'products',
  'filter.entity.projects': 'projects',
  'filter.entity.organizations': 'organizations',
  'filter.entity.playbooks': 'playbooks',
  'filter.entity.maps': 'maps'
}

const initialCounts = (() => {
  return FILTER_ITEMS.reduce((map, item) => {
    map[item] = item === 'filter.entity.maps' ? '3' : '--'
    return map
  }, {})
})()

const FilterContextProvider = ({ children }) => {
  const [resultCounts, setResultCounts] = useState(initialCounts)
  const [displayType, setDisplayType] = useState('card')
  const [filterDisplayed, setFilterDisplayed] = useState(true)
  const [openHint, setOpenHint] = useState(false)

  const props = {
    resultCounts,
    displayType,
    filterDisplayed,
    openHint,
    setResultCounts,
    setDisplayType,
    setFilterDisplayed,
    setOpenHint
  }

  return (
    <FilterContext.Provider value={{ ...props }}>
      {children}
    </FilterContext.Provider>
  )
}

export { FilterContextProvider, FilterContext }
