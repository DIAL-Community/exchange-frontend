import { createContext, useState } from 'react'

const SDGFilterContext = createContext()
const SDGFilterDispatchContext = createContext()

const SDGFilterProvider = ({ children }) => {
  const [search, setSearch] = useState('')

  const sdgFilterValues = { search }
  const sdgFilterDispatchValues = { setSearch }

  return (
    <SDGFilterContext.Provider value={sdgFilterValues}>
      <SDGFilterDispatchContext.Provider value={sdgFilterDispatchValues}>
        {children}
      </SDGFilterDispatchContext.Provider>
    </SDGFilterContext.Provider>
  )
}

export {
  SDGFilterProvider,
  SDGFilterContext,
  SDGFilterDispatchContext
}
