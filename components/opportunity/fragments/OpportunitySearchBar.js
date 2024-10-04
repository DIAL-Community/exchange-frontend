import { forwardRef, useContext } from 'react'
import { FilterContext, FilterDispatchContext } from '../../context/FilterContext'
import MobileFilter from '../../shared/MobileFilter'
import SearchBar from '../../shared/SearchBar'
import OpportunityFilter from './OpportunityFilter'

const OpportunitySearchBar = forwardRef((_, ref) => {
  const { search } = useContext(FilterContext)
  const { setSearch } = useContext(FilterDispatchContext)

  const mobileFilter =
    <MobileFilter
      bgColor='bg-dial-spearmint'
      iconColor='text-dial-plum'
      entityFilter={<OpportunityFilter />}
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

OpportunitySearchBar.displayName = 'OpportunitySearchBar'

export default OpportunitySearchBar
