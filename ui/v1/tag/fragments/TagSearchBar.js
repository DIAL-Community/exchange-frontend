import { forwardRef, useContext } from 'react'
import { FilterContext }
  from '../../../../components/context/FilterContext'
import SearchBar from '../../shared/SearchBar'

const TagSearchBar = forwardRef((_, ref) => {
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

TagSearchBar.displayName = 'TagSearchBar'

export default TagSearchBar
