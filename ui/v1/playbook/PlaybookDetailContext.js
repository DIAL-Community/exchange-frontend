import { createContext, useState } from 'react'

const PlaybookDetailContext = createContext()
const PlaybookDetailDispatchContext = createContext()

const PlaybookDetailProvider = ({ children }) => {
  const [slugYValues, setSlugYValues] = useState({})
  const [slugHeights, setSlugHeights] = useState({})
  const [windowHeight, setWindowHeight] = useState()

  const [currentSlug, setCurrentSlug] = useState('base-slug-overview-information')
  const [direct, setDirect] = useState(false)

  const updateSlugInformation = (slug, yValue, height) => {
    slugYValues[slug] = yValue
    setSlugYValues({ ...slugYValues })

    slugHeights[slug] = height
    setSlugHeights({ ...slugHeights })
  }

  const values = { slugYValues, slugHeights, currentSlug, direct, windowHeight }
  const dispatchValues = { updateSlugInformation, setCurrentSlug, setDirect, setWindowHeight }

  return (
    <PlaybookDetailContext.Provider value={values}>
      <PlaybookDetailDispatchContext.Provider value={dispatchValues}>
        {children}
      </PlaybookDetailDispatchContext.Provider>
    </PlaybookDetailContext.Provider>
  )
}

export { PlaybookDetailProvider, PlaybookDetailContext, PlaybookDetailDispatchContext }
