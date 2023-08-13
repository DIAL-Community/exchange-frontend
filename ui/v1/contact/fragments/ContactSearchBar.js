import { forwardRef, useContext } from 'react'
import { FilterContext } from '../../../../components/context/FilterContext'
import SearchBar from '../../shared/SearchBar'

const ContactSearchBar = forwardRef((_, ref) => {
  const { search } = useContext(FilterContext)
  const { setSearch } = useContext(FilterContext)

  return (
    <div ref={ref} className='py-3'>
      <SearchBar
        search={search}
        setSearch={setSearch}
      />
    </div>
  )
})

ContactSearchBar.displayName = 'ContactSearchBar'

export default ContactSearchBar
