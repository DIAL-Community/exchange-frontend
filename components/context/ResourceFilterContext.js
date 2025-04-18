import { createContext, useState } from 'react'

const ResourceFilterContext = createContext()
const ResourceFilterDispatchContext = createContext()

const ResourceFilterProvider = ({ children }) => {
  const [search, setSearch] = useState('')
  const [resourceTypes, setResourceTypes] = useState([])
  const [resourceTopics, setResourceTopics] = useState([])
  const [resourceCountries, setResourceCountries] = useState([])
  const [resourceTags, setResourceTags] = useState([])

  const resourceFilterValues = {
    search,
    resourceTypes,
    resourceTopics,
    resourceCountries,
    resourceTags
  }
  const resourceFilterDispatchValues = {
    setSearch,
    setResourceTypes,
    setResourceTopics,
    setResourceCountries,
    setResourceTags
  }

  return (
    <ResourceFilterContext.Provider value={resourceFilterValues}>
      <ResourceFilterDispatchContext.Provider value={resourceFilterDispatchValues}>
        {children}
      </ResourceFilterDispatchContext.Provider>
    </ResourceFilterContext.Provider>
  )
}

export {
  ResourceFilterProvider,
  ResourceFilterContext,
  ResourceFilterDispatchContext
}
