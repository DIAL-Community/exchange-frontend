import { createContext, useState } from 'react'

const UseCaseFilterContext = createContext()
const UseCaseFilterDispatchContext = createContext()

const UseCaseFilterProvider = ({ children }) => {
  const [showBeta, setShowBeta] = useState(false)
  const [govStackOnly, setShowGovStack] = useState(false)
  const [sectors, setSectors] = useState([])
  const [sdgs, setSdgs] = useState([])

  const [search, setSearch] = useState('')

  const useCaseFilterValues = {
    showBeta,
    govStackOnly,
    sectors,
    sdgs,
    search
  }

  const useCaseFilterDispatchValues = {
    setShowBeta,
    setShowGovStack,
    setSectors,
    setSdgs,
    setSearch
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
