import ProductListLeft from './fragments/ProductListLeft'
import ProductSimpleLeft from './fragments/ProductSimpleLeft'

const ProductMainLeft = ({ activeTab }) => {

  return (
    <>
      {activeTab === 0 && <ProductListLeft />}
      {activeTab === 1 && <ProductSimpleLeft />}
      {activeTab === 2 && <ProductSimpleLeft />}
    </>
  )
}

export default ProductMainLeft
