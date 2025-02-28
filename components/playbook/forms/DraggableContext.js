import { createContext, useState } from 'react'

const DraggableContext = createContext()

const DraggableContextProvider = ({ children }) => {
  const [currentPlays, setCurrentPlays] = useState([])
  const [currentPlayMoves, setCurrentPlayMoves] = useState([])
  const [dirty, setDirty] = useState(false)

  const values = {
    dirty,
    currentPlays,
    currentPlayMoves,
    setDirty,
    setCurrentPlays,
    setCurrentPlayMoves
  }

  return (
    <DraggableContext.Provider value={values}>
      {children}
    </DraggableContext.Provider>
  )
}

export { DraggableContextProvider, DraggableContext }
