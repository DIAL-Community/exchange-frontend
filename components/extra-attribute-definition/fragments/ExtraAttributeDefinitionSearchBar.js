import { forwardRef, useContext } from 'react'
import { FilterContext, FilterDispatchContext } from '../../context/FilterContext'
import SearchBar from '../../shared/SearchBar'

const ExtraAttributeDefinitionSearchBar = forwardRef((_, ref) => {
  const { search } = useContext(FilterContext)
  const { setSearch } = useContext(FilterDispatchContext)

  return (
    <div ref={ref} className='py-3'>
      <SearchBar
        search={search}
        setSearch={setSearch}
      />
    </div>
  )
})

ExtraAttributeDefinitionSearchBar.displayName = 'ExtraAttributeDefinitionSearchBar'

export default ExtraAttributeDefinitionSearchBar
