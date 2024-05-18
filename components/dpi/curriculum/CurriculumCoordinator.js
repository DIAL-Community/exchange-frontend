import { createContext, useState } from 'react'

export const OVERVIEW_SLUG_NAME = 'base-slug-overview-information'
const CurriculumContext = createContext()

const CurriculumCoordinator = ({ children }) => {
  const [currentSlug, setCurrentSlug] = useState(OVERVIEW_SLUG_NAME)

  const values = { currentSlug, setCurrentSlug }

  return (
    <CurriculumContext.Provider value={values}>
      {children}
    </CurriculumContext.Provider>
  )
}

export { CurriculumCoordinator, CurriculumContext }
