import { forwardRef, useContext } from 'react'
import { FilterContext } from '../../context/FilterContext'
import SearchBar from '../../shared/SearchBar'

const ResourceSearchBar = forwardRef((_, ref) => {
  const { search } = useContext(FilterContext)
  const { setSearch } = useContext(FilterContext)

  return (
    <div ref={ref} className='py-3'>
      <div className='inline grid grid-cols-5 items-center'>
        <div className='text-gray pr-4'>Search Resource Hub</div>
        <div className='col-span-3'>
          <SearchBar
            search={search}
            setSearch={setSearch}
          />
        </div>
        <div></div>
      </div>
    </div>
  )
})

ResourceSearchBar.displayName = 'ResourceSearchBar'

export default ResourceSearchBar
