import { forwardRef, useContext } from 'react'
import { UseCaseFilterContext, UseCaseFilterDispatchContext }
  from '../../../../components/context/UseCaseFilterContext'
import SearchBar from '../../shared/SearchBar'

const UseCaseSearchBar = forwardRef((_, ref) => {
  const { search } = useContext(UseCaseFilterContext)
  const { setSearch } = useContext(UseCaseFilterDispatchContext)

  return (
    <div ref={ref} className='py-3'>
      <SearchBar search={search} setSearch={setSearch} />
    </div>
  )
})

UseCaseSearchBar.displayName = 'UseCaseSearchBar'

export default UseCaseSearchBar
