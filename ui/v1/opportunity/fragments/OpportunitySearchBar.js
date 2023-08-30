import { forwardRef, useContext } from 'react'
import { OpportunityFilterContext, OpportunityFilterDispatchContext }
  from '../../../../components/context/OpportunityFilterContext'
import SearchBar from '../../shared/SearchBar'
import MobileFilter from '../../shared/MobileFilter'
import OpportunityFilter from './OpportunityFilter'

const OpportunitySearchBar = forwardRef((_, ref) => {
  const { search } = useContext(OpportunityFilterContext)
  const { setSearch } = useContext(OpportunityFilterDispatchContext)

  const mobileFilter =
    <MobileFilter
      bgColor='bg-dial-spearmint'
      iconColor='text-dial-plum'
      entityFilter={<OpportunityFilter/>}
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
