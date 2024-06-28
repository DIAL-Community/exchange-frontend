import { forwardRef, useContext } from 'react'
import { ProductFilterContext, ProductFilterDispatchContext }
  from '../../context/ProductFilterContext'
import SearchBar from '../../shared/SearchBar'
import MobileFilter from '../../shared/MobileFilter'
import ProductFilter from './ProductFilter'

const ProductSearchBar = forwardRef((_, ref) => {
  const { search } = useContext(ProductFilterContext)
  const { setSearch } = useContext(ProductFilterDispatchContext)

  const mobileFilter =
    <MobileFilter
      bgColor='bg-dial-spearmint'
      iconColor='text-dial-meadow'
      entityFilter={<ProductFilter/>}
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
