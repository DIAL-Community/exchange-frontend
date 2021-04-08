import React, { createContext, useState } from 'react'

const ProjectFilterContext = createContext()
const ProjectFilterDispatchContext = createContext()

function ProjectFilterProvider ({ children }) {
  const [origins, setOrigins] = useState([])
  const [countries, setCountries] = useState([])
  const [sectors, setSectors] = useState([])
  const [organizations, setOrganizations] = useState([])
  const [sdgs, setSDGs] = useState([])

  const projectFilterValues = {
    origins, countries, sectors, organizations, sdgs
  }
  const projectFilterDispatchValues = {
    setOrigins,
    setCountries,
    setSectors,
    setOrganizations,
    setSDGs
  }

  return (
    <ProjectFilterContext.Provider value={projectFilterValues}>
      <ProjectFilterDispatchContext.Provider value={projectFilterDispatchValues}>
        {children}
      </ProjectFilterDispatchContext.Provider>
    </ProjectFilterContext.Provider>
  )
}

export { ProjectFilterProvider, ProjectFilterContext, ProjectFilterDispatchContext }
