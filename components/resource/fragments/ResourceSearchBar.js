import { forwardRef, useContext } from 'react'
import { FilterContext } from '../../context/FilterContext'
import SearchBar from '../../shared/SearchBar'

const ResourceSearchBar = forwardRef((_, ref) => {
  const { search } = useContext(FilterContext)
  const { setSearch } = useContext(FilterContext)

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
