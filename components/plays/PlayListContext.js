import { createContext, useState } from 'react'

const PlayListContext = createContext()
const PlayListDispatchContext = createContext()

const PlayListProvider = ({ children }) => {
  const [tags, setTags] = useState([])
  const [currentPlays, setCurrentPlays] = useState([])

  const values = { currentPlays, tags }
  const dispatchValues = { setCurrentPlays, setTags }
  return (
    <PlayListContext.Provider value={values}>
      <PlayListDispatchContext.Provider value={dispatchValues}>
        {children}
      </PlayListDispatchContext.Provider>
    </PlayListContext.Provider>
  )
}

export { PlayListProvider, PlayListContext, PlayListDispatchContext }
