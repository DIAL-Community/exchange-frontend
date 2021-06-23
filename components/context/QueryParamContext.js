import { createContext, useState } from 'react'

const QueryParamContext = createContext()
const QueryParamContextProvider = ({ children }) => {
  const [interactionDetected, setInteractionDetected] = useState(false)
  return (
    <QueryParamContext.Provider value={{ ...{ interactionDetected, setInteractionDetected } }}>
      {children}
    </QueryParamContext.Provider>
  )
}

export { QueryParamContextProvider, QueryParamContext }
