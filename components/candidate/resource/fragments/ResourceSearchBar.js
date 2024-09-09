import { forwardRef, useContext } from 'react'
import { ResourceFilterContext, ResourceFilterDispatchContext } from '../../../context/ResourceFilterContext'
import SearchBar from '../../../shared/SearchBar'

const ResourceSearchBar = forwardRef((_, ref) => {
  const { search } = useContext(ResourceFilterContext)
  const { setSearch } = useContext(ResourceFilterDispatchContext)

  return (
    <div ref={ref} className='py-3'>
      <SearchBar
        search={search}
        setSearch={setSearch}
      />
    </div>
  )
})

ResourceSearchBar.displayName = 'ResourceSearchBar'

export default ResourceSearchBar
