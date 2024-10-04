import { forwardRef, useContext } from 'react'
import SearchBar from '../../../../shared/SearchBar'
import { FilterContext, FilterDispatchContext } from '../../../../context/FilterContext'

const RoleSearchBar = forwardRef((_, ref) => {
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

RoleSearchBar.displayName = 'RoleSearchBar'

export default RoleSearchBar
