import React, { createContext, useState } from 'react'

const UseCaseFilterContext = createContext()
const UseCaseFilterDispatchContext = createContext()

function UseCaseFilterProvider ({ children }) {
  const [showBeta, setShowBeta] = useState(false)
  const [sectors, setSectors] = useState([])
  const [sdgs, setSDGs] = useState([])

  const useCaseFilterValues = {
    showBeta, sectors, sdgs
  }
  const useCaseFilterDispatchValues = {
    setShowBeta,
    setSectors,
    setSDGs
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
