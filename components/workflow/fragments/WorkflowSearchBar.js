import { forwardRef, useContext } from 'react'
import { WorkflowFilterContext, WorkflowFilterDispatchContext }
  from '../../context/WorkflowFilterContext'
import SearchBar from '../../shared/SearchBar'
import MobileFilter from '../../shared/MobileFilter'
import WorkflowFilter from './WorkflowFilter'

const WorkflowSearchBar = forwardRef((_, ref) => {
  const { search } = useContext(WorkflowFilterContext)
  const { setSearch } = useContext(WorkflowFilterDispatchContext)

  const mobileFilter =
    <MobileFilter
      bgColor='bg-dial-violet'
      iconColor='text-dial-plum'
      entityFilter={<WorkflowFilter/>}
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

WorkflowSearchBar.displayName = 'WorkflowSearchBar'

export default WorkflowSearchBar
