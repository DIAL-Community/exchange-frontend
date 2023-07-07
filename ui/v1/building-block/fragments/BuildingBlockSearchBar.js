import { forwardRef, useContext } from 'react'
import { BuildingBlockFilterContext, BuildingBlockFilterDispatchContext }
  from '../../../../components/context/BuildingBlockFilterContext'
import SearchBar from '../../shared/SearchBar'

const BuildingBlockSearchBar = forwardRef((_, ref) => {
  const { search } = useContext(BuildingBlockFilterContext)
  const { setSearch } = useContext(BuildingBlockFilterDispatchContext)

  return (
    <div ref={ref} className='py-3'>
      <SearchBar search={search} setSearch={setSearch} />
    </div>
  )
})

BuildingBlockSearchBar.displayName = 'BuildingBlockSearchBar'

export default BuildingBlockSearchBar
