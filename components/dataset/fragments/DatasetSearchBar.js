import { forwardRef, useContext } from 'react'
import { FilterContext, FilterDispatchContext } from '../../context/FilterContext'
import MobileFilter from '../../shared/MobileFilter'
import SearchBar from '../../shared/SearchBar'
import DatasetFilter from './DatasetFilter'

const DatasetSearchBar = forwardRef((_, ref) => {
  const { search } = useContext(FilterContext)
  const { setSearch } = useContext(FilterDispatchContext)

  const mobileFilter =
    <MobileFilter
      bgColor='bg-dial-violet'
      iconColor='text-dial-plum'
      entityFilter={<DatasetFilter />}
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

DatasetSearchBar.displayName = 'DatasetSearchBar'

export default DatasetSearchBar
