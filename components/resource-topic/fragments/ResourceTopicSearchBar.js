import { forwardRef, useContext } from 'react'
import { FilterContext }
  from '../../context/FilterContext'
import SearchBar from '../../shared/SearchBar'

const ResourceTopicSearchBar = forwardRef((_, ref) => {
  const { search, setSearch } = useContext(FilterContext)

  return (
    <div ref={ref} className='py-3'>
      <SearchBar
        search={search}
        setSearch={setSearch}
      />
    </div>
  )
})

ResourceTopicSearchBar.displayName = 'ResourceTopicSearchBar'

export default ResourceTopicSearchBar
