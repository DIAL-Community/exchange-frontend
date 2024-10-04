import { forwardRef, useContext } from 'react'
import { FilterContext, FilterDispatchContext } from '../../../context/FilterContext'
import MobileFilter from '../../../shared/MobileFilter'
import SearchBar from '../../../shared/SearchBar'
import ProductFilter from './ProductFilter'

const ProductSearchBar = forwardRef((_, ref) => {
  const { search } = useContext(FilterContext)
  const { setSearch } = useContext(FilterDispatchContext)

  const mobileFilter =
    <MobileFilter
      bgColor='bg-dial-spearmint'
      iconColor='text-dial-meadow'
      entityFilter={<ProductFilter />}
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

ProductSearchBar.displayName = 'ProductSearchBar'

export default ProductSearchBar
