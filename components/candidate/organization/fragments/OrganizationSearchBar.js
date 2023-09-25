import { forwardRef, useContext } from 'react'
import { OrganizationFilterContext, OrganizationFilterDispatchContext }
  from '../../../context/OrganizationFilterContext'
import SearchBar from '../../../shared/SearchBar'

const OrganizationSearchBar = forwardRef((_, ref) => {
  const { search } = useContext(OrganizationFilterContext)
  const { setSearch } = useContext(OrganizationFilterDispatchContext)

  return (
    <div ref={ref} className='py-3'>
      <SearchBar
        search={search}
        setSearch={setSearch}
      />
    </div>
  )
})

OrganizationSearchBar.displayName = 'OrganizationSearchBar'

export default OrganizationSearchBar
