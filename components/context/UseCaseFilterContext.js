import { createContext, useState } from 'react'

const UseCaseFilterContext = createContext()
const UseCaseFilterDispatchContext = createContext()

const UseCaseFilterProvider = ({ children }) => {
  const [showBeta, setShowBeta] = useState(false)
  const [showGovStackOnly, setShowGovStackOnly] = useState(false)
  const [sectors, setSectors] = useState([])
  const [sdgs, setSdgs] = useState([])

  const [search, setSearch] = useState('')

  const [pageNumber, setPageNumber] = useState(0)
  const [pageOffset, setPageOffset] = useState(0)

  const useCaseFilterValues = {
    showBeta,
    showGovStackOnly,
    sectors,
    sdgs,
    search,
    pageOffset,
    pageNumber
  }

  const useCaseFilterDispatchValues = {
    setShowBeta,
    setShowGovStackOnly,
    setSectors,
    setSdgs,
    setSearch,
    setPageNumber,
    setPageOffset
  }

  return (
    <UseCaseFilterContext.Provider value={useCaseFilterValues}>
      <UseCaseFilterDispatchContext.Provider value={useCaseFilterDispatchValues}>
        {children}
      </UseCaseFilterDispatchContext.Provider>
    </UseCaseFilterContext.Provider>
  )
}

export { UseCaseFilterProvider, UseCaseFilterContext, UseCaseFilterDispatchContext }
