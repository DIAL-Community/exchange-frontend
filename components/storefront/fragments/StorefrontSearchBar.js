import { forwardRef, useContext } from 'react'
import { OrganizationFilterContext, OrganizationFilterDispatchContext }
  from '../../context/OrganizationFilterContext'
import SearchBar from '../../shared/SearchBar'
import MobileFilter from '../../shared/MobileFilter'
import StorefrontFilter from './StorefrontFilter'

const StorefrontSearchBar = forwardRef((_, ref) => {
  const { search } = useContext(OrganizationFilterContext)
  const { setSearch } = useContext(OrganizationFilterDispatchContext)

  const mobileFilter =
    <MobileFilter
      bgColor='bg-dial-violet'
      iconColor='text-dial-plum'
      entityFilter={<StorefrontFilter/>}
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

StorefrontSearchBar.displayName = 'StorefrontSearchBar'

export default StorefrontSearchBar
