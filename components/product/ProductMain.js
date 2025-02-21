import ProductMainLeft from './ProductMainLeft'
import ProductMainRight from './ProductMainRight'

const ProductMain = ({ activeTab }) => {
  return (
    <div className='px-4 lg:px-8 xl:px-56'>
      <div className='grid grid-cols-4 gap-x-8'>
        <div className='hidden md:block col-span-1'>
          <ProductMainLeft activeTab={activeTab} />
        </div>
        <div className='col-span-4 md:col-span-3'>
          <ProductMainRight activeTab={activeTab} />
        </div>
      </div>
    </div>
  )
}

export default ProductMain
