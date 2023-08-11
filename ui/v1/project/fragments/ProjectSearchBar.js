import { forwardRef, useContext } from 'react'
import { ProjectFilterContext, ProjectFilterDispatchContext }
  from '../../../../components/context/ProjectFilterContext'
import SearchBar from '../../shared/SearchBar'
import MobileFilter from '../../shared/MobileFilter'
import ProjectFilter from './ProjectFilter'

const ProjectSearchBar = forwardRef((_, ref) => {
  const { search } = useContext(ProjectFilterContext)
  const { setSearch } = useContext(ProjectFilterDispatchContext)

  const mobileFilter =
    <MobileFilter
      bgColor='bg-dial-spearmint'
      iconColor='text-dial-meadow'
      entityFilter={<ProjectFilter/>}
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

ProjectSearchBar.displayName = 'ProjectSearchBar'

export default ProjectSearchBar
