import { createContext, useState } from 'react'

const PlayListContext = createContext()
const PlayListDispatchContext = createContext()

const PlayListProvider = ({ children }) => {
  const [currentPlays, setCurrentPlays] = useState([])
  const [dirty, setDirty] = useState(false)

  const values = { currentPlays, dirty }
  const dispatchValues = { setCurrentPlays, setDirty }

  return (
    <PlayListContext.Provider value={values}>
      <PlayListDispatchContext.Provider value={dispatchValues}>
        {children}
      </PlayListDispatchContext.Provider>
    </PlayListContext.Provider>
  )
}

export { PlayListProvider, PlayListContext, PlayListDispatchContext }
