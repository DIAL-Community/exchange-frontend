import { createContext, useState } from 'react'

export const OVERVIEW_SLUG_NAME = 'base-slug-overview-information'

const CurriculumContext = createContext()

const CurriculumContextProvider = ({ children }) => {
  // Currently active slug
  const [currentSlug, setCurrentSlug] = useState(OVERVIEW_SLUG_NAME)
  // List of modules ordered by the defined ordering (playOrder field).
  const [modules, setModules] = useState([])
  // Map of module slugs to module names.
  const [moduleNames, setModuleNames] = useState({})
  // Map of module slugs to list of sub module names.
  const [subModuleNames, setSubModuleNames] = useState({})
  // Map of module slugs to percentage of displayed modules.
  const [modulePercentages, setModulePercentages] = useState({})

  const values = {
    currentSlug,
    setCurrentSlug,
    modules,
    moduleNames,
    subModuleNames,
    modulePercentages,
    setModules,
    setModuleNames,
    setSubModuleNames,
    setModulePercentages
  }

  return (
    <CurriculumContext.Provider value={values}>
      {children}
    </CurriculumContext.Provider>
  )

}

export { CurriculumContextProvider, CurriculumContext }
