import { forwardRef, useContext } from 'react'
import { FilterContext, FilterDispatchContext } from '../../context/FilterContext'
import MobileFilter from '../../shared/MobileFilter'
import SearchBar from '../../shared/SearchBar'
import BuildingBlockFilter from './BuildingBlockFilter'

const BuildingBlockSearchBar = forwardRef((_, ref) => {
  const { search } = useContext(FilterContext)
  const { setSearch } = useContext(FilterDispatchContext)

  const mobileFilter =
    <MobileFilter
      bgColor='bg-dial-warm-beech'
      entityFilter={<BuildingBlockFilter/>}
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

BuildingBlockSearchBar.displayName = 'BuildingBlockSearchBar'

export default BuildingBlockSearchBar
