import { createContext, useState } from 'react'

const MoveListContext = createContext()
const MoveListDispatchContext = createContext()

const MoveListProvider = ({ children }) => {
  const [currentMoves, setCurrentMoves] = useState([])
  const [dirty, setDirty] = useState(false)

  const values = { currentMoves, dirty }
  const dispatchValues = { setCurrentMoves, setDirty }

  return (
    <MoveListContext.Provider value={values}>
      <MoveListDispatchContext.Provider value={dispatchValues}>
        {children}
      </MoveListDispatchContext.Provider>
    </MoveListContext.Provider>
  )
}

export { MoveListProvider, MoveListContext, MoveListDispatchContext }
