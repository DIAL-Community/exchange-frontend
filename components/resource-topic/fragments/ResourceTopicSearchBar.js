import { forwardRef, useContext } from 'react'
import { FilterContext, FilterDispatchContext }
  from '../../context/FilterContext'
import SearchBar from '../../shared/SearchBar'

const ResourceTopicSearchBar = forwardRef((_, ref) => {
  const { search } = useContext(FilterContext)
  const { setSearch } = useContext(FilterDispatchContext)

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
