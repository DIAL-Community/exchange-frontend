import { forwardRef, useContext } from 'react'
import { ProductFilterContext, ProductFilterDispatchContext }
  from '../../../../components/context/ProductFilterContext'
import SearchBar from '../../shared/SearchBar'

const ProductSearchBar = forwardRef((_, ref) => {
  const { search } = useContext(ProductFilterContext)
  const { setSearch } = useContext(ProductFilterDispatchContext)

  return (
    <div ref={ref} className='py-3'>
      <SearchBar search={search} setSearch={setSearch} />
    </div>
  )
})

ProductSearchBar.displayName = 'ProductSearchBar'

export default ProductSearchBar
