import { forwardRef, useContext } from 'react'
import { DatasetFilterContext, DatasetFilterDispatchContext }
  from '../../../../components/context/DatasetFilterContext'
import SearchBar from '../../shared/SearchBar'
import MobileFilter from '../../shared/MobileFilter'
import DatasetFilter from './DatasetFilter'

const DatasetSearchBar = forwardRef((_, ref) => {
  const { search } = useContext(DatasetFilterContext)
  const { setSearch } = useContext(DatasetFilterDispatchContext)

  const mobileFilter =
    <MobileFilter
      bgColor='bg-dial-violet'
      iconColor='text-dial-plum'
      entityFilter={<DatasetFilter/>}
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
