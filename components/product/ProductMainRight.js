import ProductDefinition from './fragments/ProductDefinition'
import ProductListRight from './fragments/ProductListRight'
import ProductForm from './fragments/ProductForm'

const ProductMainRight = ({ activeTab }) => {
  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && <ProductListRight /> }
      { activeTab === 1 && <ProductDefinition /> }
      { activeTab === 2 && <ProductForm /> }
    </div>
  )
}

export default ProductMainRight
