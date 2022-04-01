import { createContext, useState } from 'react'

const MovePreviewContext = createContext()
const MovePreviewDispatchContext = createContext()

const MovePreviewProvider = ({ children }) => {
  const [previewSlug, setPreviewSlug] = useState('')
  const [previewContext, setPreviewContext] = useState([])
  const [previewDisplayed, setPreviewDisplayed] = useState(false)

  const values = { previewSlug, previewContext, previewDisplayed }
  const dispatchValues = { setPreviewSlug, setPreviewContext, setPreviewDisplayed }

  return (
    <MovePreviewContext.Provider value={values}>
      <MovePreviewDispatchContext.Provider value={dispatchValues}>
        {children}
      </MovePreviewDispatchContext.Provider>
    </MovePreviewContext.Provider>
  )
}

export { MovePreviewProvider, MovePreviewContext, MovePreviewDispatchContext }
