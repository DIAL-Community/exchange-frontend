import { forwardRef, useContext } from 'react'
import { SdgFilterContext, SdgFilterDispatchContext }
  from '../../../../components/context/SdgFilterContext'
import SearchBar from '../../shared/SearchBar'
import MobileFilter from '../../shared/MobileFilter'
import SdgFilter from './SdgFilter'

const SdgSearchBar = forwardRef((_, ref) => {
  const { search } = useContext(SdgFilterContext)
  const { setSearch } = useContext(SdgFilterDispatchContext)

  const mobileFilter =
    <MobileFilter
      bgColor='bg-dial-violet'
      iconColor='text-dial-plum'
      entityFilter={<SdgFilter/>}
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

SdgSearchBar.displayName = 'SdgSearchBar'

export default SdgSearchBar
