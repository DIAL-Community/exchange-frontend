import { createContext, useState } from 'react'

const ProjectFilterContext = createContext()
const ProjectFilterDispatchContext = createContext()

const ProjectFilterProvider = ({ children }) => {
  const [origins, setOrigins] = useState([])
  const [countries, setCountries] = useState([])
  const [products, setProducts] = useState([])
  const [sectors, setSectors] = useState([])
  const [organizations, setOrganizations] = useState([])
  const [sdgs, setSdgs] = useState([])
  const [tags, setTags] = useState([])

  const [search, setSearch] = useState('')

  const [pageNumber, setPageNumber] = useState(0)
  const [pageOffset, setPageOffset] = useState(0)

  const projectFilterValues = {
    origins,
    countries,
    products,
    sectors,
    organizations,
    sdgs,
    tags,
    search,
    pageOffset,
    pageNumber
  }

  const projectFilterDispatchValues = {
    setOrigins,
    setCountries,
    setProducts,
    setSectors,
    setOrganizations,
    setSdgs,
    setTags,
    setSearch,
    setPageNumber,
    setPageOffset
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
