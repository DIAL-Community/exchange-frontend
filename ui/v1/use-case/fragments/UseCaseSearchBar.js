import { forwardRef, useContext } from 'react'
import { UseCaseFilterContext, UseCaseFilterDispatchContext }
  from '../../../../components/context/UseCaseFilterContext'
import SearchBar from '../../shared/SearchBar'
import MobileFilter from '../../shared/MobileFilter'
import UseCaseFilter from './UseCaseFilter'

const UseCaseSearchBar = forwardRef((_, ref) => {
  const { search } = useContext(UseCaseFilterContext)
  const { setSearch } = useContext(UseCaseFilterDispatchContext)

  const mobileFilter =
    <MobileFilter
      bgColor='bg-dial-blue-chalk'
      iconColor='text-dial-blueberry'
      entityFilter={<UseCaseFilter/>}
      onRibbon={false}
    />

  return (
    <div ref={ref} className='py-3'>
      <SearchBar
        search={search}
        setSearch={setSearch}
        tabletFilter={mobileFilter}
      />
    </div>
  )
})

UseCaseSearchBar.displayName = 'UseCaseSearchBar'

export default UseCaseSearchBar
