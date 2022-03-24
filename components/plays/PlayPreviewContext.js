import { createContext, useState } from 'react'

const PlayPreviewContext = createContext()
const PlayPreviewDispatchContext = createContext()

const PlayPreviewProvider = ({ children }) => {
  const [previewSlug, setPreviewSlug] = useState('')
  const [previewDisplayed, setPreviewDisplayed] = useState(false)

  const values = { previewSlug, previewDisplayed }
  const dispatchValues = { setPreviewSlug, setPreviewDisplayed }
  return (
    <PlayPreviewContext.Provider value={values}>
      <PlayPreviewDispatchContext.Provider value={dispatchValues}>
        {children}
      </PlayPreviewDispatchContext.Provider>
    </PlayPreviewContext.Provider>
  )
}

export { PlayPreviewProvider, PlayPreviewContext, PlayPreviewDispatchContext }
