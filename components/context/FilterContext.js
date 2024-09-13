import { createContext, useState } from 'react'

const FilterContext = createContext()
const FilterDispatchContext = createContext()

const FilterContextProvider = ({ children }) => {
  const [search, setSearch] = useState('')
  // Task tracker context only
  const [showFailedOnly, setShowFailedOnly] = useState(false)

  const valueProps = {
    search,
    showFailedOnly
  }

  const dispatchProps = {
    setSearch,
    setShowFailedOnly
  }

  return (
    <FilterContext.Provider value={{ ...valueProps }}>
      <FilterDispatchContext.Provider value={{...dispatchProps}}>
        {children}
      </FilterDispatchContext.Provider>
    </FilterContext.Provider>
  )
}

export { FilterContextProvider, FilterContext, FilterDispatchContext }
