import { forwardRef, useContext } from 'react'
import { BuildingBlockFilterContext, BuildingBlockFilterDispatchContext }
  from '../../../../components/context/BuildingBlockFilterContext'
import SearchBar from '../../shared/SearchBar'
import MobileFilter from '../../shared/MobileFilter'
import BuildingBlockFilter from './BuildingBlockFilter'

const BuildingBlockSearchBar = forwardRef((_, ref) => {
  const { search } = useContext(BuildingBlockFilterContext)
  const { setSearch } = useContext(BuildingBlockFilterDispatchContext)

  const mobileFilter =
    <MobileFilter
      bgColor='bg-dial-warm-beech'
      iconColor='text-dial-ochre'
      entityFilter={<BuildingBlockFilter/>}
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

BuildingBlockSearchBar.displayName = 'BuildingBlockSearchBar'

export default BuildingBlockSearchBar
