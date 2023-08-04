import { forwardRef, useContext } from 'react'
import { FilterContext }
  from '../../../../components/context/FilterContext'
import SearchBar from '../../shared/SearchBar'
import MobileFilter from '../../shared/MobileFilter'
import TagFilter from './TagFilter'

const TagSearchBar = forwardRef((_, ref) => {
  const { search, setSearch } = useContext(FilterContext)

  const mobileFilter =
    <MobileFilter
      bgColor='bg-dial-violet'
      iconColor='text-dial-plum'
      entityFilter={<TagFilter/>}
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

TagSearchBar.displayName = 'TagSearchBar'

export default TagSearchBar
