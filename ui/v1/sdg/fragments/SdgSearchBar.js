import { forwardRef, useContext } from 'react'
import { SDGFilterContext, SDGFilterDispatchContext }
  from '../../../../components/context/SDGFilterContext'
import SearchBar from '../../shared/SearchBar'

const SdgSearchBar = forwardRef((_, ref) => {
  const { search } = useContext(SDGFilterContext)
  const { setSearch } = useContext(SDGFilterDispatchContext)

  return (
    <div ref={ref} className='py-3'>
      <SearchBar
        search={search}
        setSearch={setSearch}
      />
    </div>
  )
})

SdgSearchBar.displayName = 'SdgSearchBar'

export default SdgSearchBar
