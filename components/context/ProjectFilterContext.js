import React, { createContext, useState } from 'react'

const ProjectFilterContext = createContext()
const ProjectFilterDispatchContext = createContext()

const ProjectFilterProvider = ({ children }) => {
  const [origins, setOrigins] = useState([])
  const [countries, setCountries] = useState([])
  const [products, setProducts] = useState([])
  const [sectors, setSectors] = useState([])
  const [organizations, setOrganizations] = useState([])
  const [sdgs, setSDGs] = useState([])
  const [tags, setTags] = useState([])

  const [search, setSearch] = useState('')
  const [sortColumn, setSortColumn] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')

  const projectFilterValues = {
    origins, countries, products, sectors, organizations, sdgs, tags, search, sortColumn, sortDirection
  }
  const projectFilterDispatchValues = {
    setOrigins,
    setCountries,
    setProducts,
    setSectors,
    setOrganizations,
    setSDGs,
    setTags,
    setSearch,
    setSortColumn,
    setSortDirection
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
