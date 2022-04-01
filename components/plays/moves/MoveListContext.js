import { createContext, useState } from 'react'

const MoveListContext = createContext()
const MoveListDispatchContext = createContext()

const MoveListProvider = ({ children }) => {
  const [currentMoves, setCurrentMoves] = useState([])

  const values = { currentMoves }
  const dispatchValues = { setCurrentMoves }

  return (
    <MoveListContext.Provider value={values}>
      <MoveListDispatchContext.Provider value={dispatchValues}>
        {children}
      </MoveListDispatchContext.Provider>
    </MoveListContext.Provider>
  )
}

export { MoveListProvider, MoveListContext, MoveListDispatchContext }
