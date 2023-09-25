import { forwardRef, useContext } from 'react'
import { PlaybookFilterContext, PlaybookFilterDispatchContext }
  from '../../context/PlaybookFilterContext'
import SearchBar from '../../shared/SearchBar'
import MobileFilter from '../../shared/MobileFilter'
import PlaybookFilter from './PlaybookFilter'

const PlaybookSearchBar = forwardRef((_, ref) => {
  const { search } = useContext(PlaybookFilterContext)
  const { setSearch } = useContext(PlaybookFilterDispatchContext)

  const mobileFilter =
    <MobileFilter
      bgColor='bg-dial-spearmint'
      iconColor='text-dial-meadow'
      entityFilter={<PlaybookFilter/>}
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

PlaybookSearchBar.displayName = 'PlaybookSearchBar'

export default PlaybookSearchBar
