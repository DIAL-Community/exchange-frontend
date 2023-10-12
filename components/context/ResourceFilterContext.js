import React, { createContext, useState } from 'react'

const ResourceFilterContext = createContext()
const ResourceFilterDispatchContext = createContext()

const ResourceFilterProvider = ({ children }) => {
  const [search, setSearch] = useState('')
  const [resourceTypes, setResourceTypes] = useState([])
  const [resourceTopics, setResourceTopics] = useState([])
  const [resourceCountries, setResourceCountries] = useState([])

  const resourceFilterValues = {
    search,
    resourceTypes,
    resourceTopics,
    resourceCountries
  }
  const resourceFilterDispatchValues = {
    setSearch,
    setResourceTypes,
    setResourceTopics,
    setResourceCountries
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
