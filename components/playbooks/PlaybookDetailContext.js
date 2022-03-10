import { createContext, useState } from 'react'

const PlaybookDetailContext = createContext()
const PlaybookDetailDispatchContext = createContext()

const PlaybookDetailProvider = ({ children }) => {
  const [slugYValues, setSlugYValues] = useState({})
  const [slugHeights, setSlugHeights] = useState({})
  const [windowHeight, setWindowHeight] = useState()
  const [slugIntersectionRatios, setSlugIntersectionRatios] = useState({})

  const [currentSlug, setCurrentSlug] = useState('')

  const updateSlugInformation = (slug, yValue, height, windowHeight, intersectionRatio) => {
    setWindowHeight(windowHeight)

    slugYValues[slug] = yValue
    setSlugYValues({ ...slugYValues })

    slugHeights[slug] = height
    setSlugHeights({ ...slugHeights })

    slugIntersectionRatios[slug] = intersectionRatio
    setSlugIntersectionRatios({ ...slugIntersectionRatios })
  }

  const values = { currentSlug, slugYValues, slugHeights, windowHeight, slugIntersectionRatios }
  const dispatchValues = { updateSlugInformation, setCurrentSlug }
  return (
    <PlaybookDetailContext.Provider value={values}>
      <PlaybookDetailDispatchContext.Provider value={dispatchValues}>
        {children}
      </PlaybookDetailDispatchContext.Provider>
    </PlaybookDetailContext.Provider>
  )
}

export { PlaybookDetailProvider, PlaybookDetailContext, PlaybookDetailDispatchContext }
