import ProductMainLeft from './ProductMainLeft'
import ProductMainRight from './ProductMainRight'

const ProductMain = ({ activeTab }) => {
  return (
    <div className='px-8 xl:px-56'>
      <div className='grid grid-cols-3 gap-x-8'>
        <div className='col-span-1'>
          <ProductMainLeft activeTab={activeTab} />
        </div>
        <div className='col-span-2'>
          <ProductMainRight activeTab={activeTab} />
        </div>
      </div>
    </div>
  )
}

export default ProductMain