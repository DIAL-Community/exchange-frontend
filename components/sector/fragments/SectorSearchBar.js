import { forwardRef, useContext } from 'react'
import { FilterContext } from '../../context/FilterContext'
import SearchBar from '../../shared/SearchBar'

const SectorSearchBar = forwardRef((_, ref) => {
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

SectorSearchBar.displayName = 'SectorSearchBar'

export default SectorSearchBar
