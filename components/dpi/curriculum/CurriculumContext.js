import { createContext, useState } from 'react'

export const OVERVIEW_SLUG_NAME = 'base-slug-overview-information'

const CurriculumContext = createContext()

const CurriculumContextProvider = ({ children }) => {
  // Currently active slug
  const [currentSlug, setCurrentSlug] = useState(OVERVIEW_SLUG_NAME)
  // Map of module slugs to module names.
  const [moduleNames, setModuleNames] = useState({})
  // Map of module slugs to list of sub module names.
  const [subModuleNames, setSubModuleNames] = useState({})
  // List of modules ordered by the defined ordering (playOrder field).
  const [modules, setModules] = useState([])

  const values = {
    currentSlug,
    setCurrentSlug,
    modules,
    moduleNames,
    subModuleNames,
    setModules,
    setModuleNames,
    setSubModuleNames
  }

  return (
    <CurriculumContext.Provider value={values}>
      {children}
    </CurriculumContext.Provider>
  )

}

export { CurriculumContextProvider, CurriculumContext }
