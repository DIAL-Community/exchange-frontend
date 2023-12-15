import { forwardRef, useContext } from 'react'
import { FilterContext } from '../../context/FilterContext'
import SearchBar from '../../shared/SearchBar'

const RegionSearchBar = forwardRef((_, ref) => {
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

RegionSearchBar.displayName = 'RegionSearchBar'

export default RegionSearchBar
