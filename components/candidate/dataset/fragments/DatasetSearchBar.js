import { forwardRef, useContext } from 'react'
import { DatasetFilterContext, DatasetFilterDispatchContext }
  from '../../../context/DatasetFilterContext'
import SearchBar from '../../../shared/SearchBar'

const DatasetSearchBar = forwardRef((_, ref) => {
  const { search } = useContext(DatasetFilterContext)
  const { setSearch } = useContext(DatasetFilterDispatchContext)

  return (
    <div ref={ref} className='py-3'>
      <SearchBar
        search={search}
        setSearch={setSearch}
      />
    </div>
  )
})

DatasetSearchBar.displayName = 'DatasetSearchBar'

export default DatasetSearchBar
