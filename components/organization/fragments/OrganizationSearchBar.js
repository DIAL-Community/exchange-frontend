import { forwardRef, useContext } from 'react'
import { FilterContext, FilterDispatchContext } from '../../context/FilterContext'
import MobileFilter from '../../shared/MobileFilter'
import SearchBar from '../../shared/SearchBar'
import OrganizationFilter from './OrganizationFilter'

const OrganizationSearchBar = forwardRef((_, ref) => {
  const { search } = useContext(FilterContext)
  const { setSearch } = useContext(FilterDispatchContext)

  const mobileFilter =
    <MobileFilter
      bgColor='bg-dial-violet'
      iconColor='text-dial-plum'
      entityFilter={<OrganizationFilter />}
    />

  return (
    <div ref={ref} className='py-3'>
      <SearchBar
        search={search}
        setSearch={setSearch}
        mobileFilter={mobileFilter}
      />
    </div>
  )
})

OrganizationSearchBar.displayName = 'OrganizationSearchBar'

export default OrganizationSearchBar
