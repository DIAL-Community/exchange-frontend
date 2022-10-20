import { useRef } from 'react'
import ProductDetailLeft from './ProductDetailLeft'
import ProductDetailRight from './ProductDetailRight'

const ProductDetail = ({ product }) => {

  const commentsSectionElement = useRef()

  return (
    product && (
      <div className='flex flex-col lg:flex-row justify-between pb-8'>
        <div className='relative lg:sticky lg:top-66px w-full lg:w-1/3 xl:w-1/4 h-full py-4 px-4'>
          <ProductDetailLeft product={product} commentsSectionRef={commentsSectionElement}  />
        </div>
        <div className='w-full lg:w-2/3 xl:w-3/4'>
          <ProductDetailRight product={product} commentsSectionRef={commentsSectionElement} />
        </div>
      </div>
    )
  )
}

export default ProductDetail
