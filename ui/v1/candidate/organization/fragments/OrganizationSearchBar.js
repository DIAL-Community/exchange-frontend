import { forwardRef, useContext } from 'react'
import { OrganizationFilterContext, OrganizationFilterDispatchContext }
  from '../../../../../components/context/OrganizationFilterContext'
import SearchBar from '../../../shared/SearchBar'
import MobileFilter from '../../../shared/MobileFilter'
import OrganizationFilter from './OrganizationFilter'

const OrganizationSearchBar = forwardRef((_, ref) => {
  const { search } = useContext(OrganizationFilterContext)
  const { setSearch } = useContext(OrganizationFilterDispatchContext)

  const mobileFilter =
    <MobileFilter
      bgColor='bg-dial-violet'
      iconColor='text-dial-plum'
      entityFilter={<OrganizationFilter/>}
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
