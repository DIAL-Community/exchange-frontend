import { forwardRef, useContext } from 'react'
import SearchBar from '../../shared/SearchBar'
import { ResourceFilterContext, ResourceFilterDispatchContext } from '../../context/ResourceFilterContext'

const ResourceSearchBar = forwardRef((_, ref) => {
  const { search } = useContext(ResourceFilterContext)
  const { setSearch } = useContext(ResourceFilterDispatchContext)

  return (
    <div ref={ref}>
      <SearchBar
        search={search}
        setSearch={setSearch}
      />
    </div>
  )
})

ResourceSearchBar.displayName = 'ResourceSearchBar'

export default ResourceSearchBar
