import { forwardRef, useContext } from 'react'
import SearchBar from '../../../shared/SearchBar'
import { RoleFilterContext, RoleFilterDispatchContext } from '../../../context/candidate/RoleFilterContext'

const RoleSearchBar = forwardRef((_, ref) => {
  const { search } = useContext(RoleFilterContext)
  const { setSearch } = useContext(RoleFilterDispatchContext)

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
