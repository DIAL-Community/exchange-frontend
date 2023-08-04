import { forwardRef, useContext } from 'react'
import { FilterContext } from '../../../../components/context/FilterContext'
import SearchBar from '../../shared/SearchBar'
import MobileFilter from '../../shared/MobileFilter'
import CountryFilter from './CountryFilter'

const CountrySearchBar = forwardRef((_, ref) => {
  const { search, setSearch } = useContext(FilterContext)

  const mobileFilter =
    <MobileFilter
      bgColor='bg-dial-violet'
      iconColor='text-dial-plum'
      entityFilter={<CountryFilter/>}
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

CountrySearchBar.displayName = 'CountrySearchBar'

export default CountrySearchBar
