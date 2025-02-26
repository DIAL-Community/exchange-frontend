import { forwardRef, useContext } from 'react'
import { FilterContext, FilterDispatchContext } from '../../context/FilterContext'
import MobileFilter from '../../shared/MobileFilter'
import SearchBar from '../../shared/SearchBar'
import ProjectFilter from './ProjectFilter'

const ProjectSearchBar = forwardRef((_, ref) => {
  const { search } = useContext(FilterContext)
  const { setSearch } = useContext(FilterDispatchContext)

  const mobileFilter =
    <MobileFilter
      bgColor='bg-dial-violet'
      entityFilter={<ProjectFilter />}
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

ProjectSearchBar.displayName = 'ProjectSearchBar'

export default ProjectSearchBar
