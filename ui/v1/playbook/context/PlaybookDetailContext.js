import { createContext, useState } from 'react'

const PlaybookDetailContext = createContext()
const PlaybookDetailDispatchContext = createContext()

const PlaybookDetailProvider = ({ children }) => {
  const [slugHeights, setSlugHeights] = useState({})
  const [windowHeight, setWindowHeight] = useState()

  const [currentSlug, setCurrentSlug] = useState('base-slug-overview-information')

  const values = { slugHeights, currentSlug, windowHeight }
  const dispatchValues = { setSlugHeights, setCurrentSlug, setWindowHeight }

  return (
    <PlaybookDetailContext.Provider value={values}>
      <PlaybookDetailDispatchContext.Provider value={dispatchValues}>
        {children}
      </PlaybookDetailDispatchContext.Provider>
    </PlaybookDetailContext.Provider>
  )
}

export { PlaybookDetailProvider, PlaybookDetailContext, PlaybookDetailDispatchContext }
