import React, { createContext, useState } from 'react'

const SDGFilterContext = createContext()
const SDGFilterDispatchContext = createContext()

const SDGFilterProvider = ({ children }) => {
  const [sdgs, setSDGs] = useState([])

  const sdgFilterValues = { sdgs }
  const sdgFilterDispatchValues = { setSDGs }

  return (
    <SDGFilterContext.Provider value={sdgFilterValues}>
      <SDGFilterDispatchContext.Provider value={sdgFilterDispatchValues}>
        {children}
      </SDGFilterDispatchContext.Provider>
    </SDGFilterContext.Provider>
  )
}

export { SDGFilterProvider, SDGFilterContext, SDGFilterDispatchContext }
