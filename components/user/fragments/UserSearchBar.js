import { forwardRef, useContext } from 'react'
import { UserFilterContext, UserFilterDispatchContext }
  from '../../context/UserFilterContext'
import SearchBar from '../../shared/SearchBar'

const UserSearchBar = forwardRef((_, ref) => {
  const { search } = useContext(UserFilterContext)
  const { setSearch } = useContext(UserFilterDispatchContext)

  return (
    <div ref={ref} className='py-3'>
      <SearchBar
        search={search}
        setSearch={setSearch}
      />
    </div>
  )
})

UserSearchBar.displayName = 'UserSearchBar'

export default UserSearchBar
