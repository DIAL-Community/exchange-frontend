import { createContext, useState } from 'react'

const DraggableContext = createContext()

const DraggableContextProvider = ({ children }) => {
  const [currentModules, setCurrentModules] = useState([])
  const [currentSubModules, setCurrentSubModules] = useState([])
  const [dirty, setDirty] = useState(false)

  const values = {
    currentModules,
    currentSubModules,
    dirty,
    setCurrentModules,
    setCurrentSubModules,
    setDirty
  }

  return (
    <DraggableContext.Provider value={values}>
      {children}
    </DraggableContext.Provider>
  )
}

export { DraggableContextProvider, DraggableContext }
