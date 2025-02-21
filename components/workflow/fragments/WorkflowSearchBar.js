import { forwardRef, useContext } from 'react'
import { FilterContext, FilterDispatchContext } from '../../context/FilterContext'
import MobileFilter from '../../shared/MobileFilter'
import SearchBar from '../../shared/SearchBar'
import WorkflowFilter from './WorkflowFilter'

const WorkflowSearchBar = forwardRef((_, ref) => {
  const { search } = useContext(FilterContext)
  const { setSearch } = useContext(FilterDispatchContext)

  const mobileFilter =
    <MobileFilter
      bgColor='bg-dial-violet'
      entityFilter={<WorkflowFilter />}
    />

  return (
    <div ref={ref} className='py-3'>
      <SearchBar
        multiView
        search={search}
        setSearch={setSearch}
        mobileFilter={mobileFilter}
      />
    </div>
  )
})

WorkflowSearchBar.displayName = 'WorkflowSearchBar'

export default WorkflowSearchBar
