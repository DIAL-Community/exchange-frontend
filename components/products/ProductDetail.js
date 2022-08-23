import { useApolloClient } from '@apollo/client'
import { PRODUCT_QUERY } from '../../queries/product'
import ProductDetailLeft from './ProductDetailLeft'
import ProductDetailRight from './ProductDetailRight'

const ProductDetail = ({ slug }) => {
  const client = useApolloClient()

  const { product } = client.readQuery({
    query: PRODUCT_QUERY,
    variables: { slug }
  })

  return (
    product && (
      <div className='flex flex-col lg:flex-row justify-between pb-8 max-w-catalog mx-auto'>
        <div className='relative lg:sticky lg:top-66px w-full lg:w-1/3 xl:w-1/4 h-full py-4 px-4'>
          <ProductDetailLeft product={product} />
        </div>
        <div className='w-full lg:w-2/3 xl:w-3/4'>
          <ProductDetailRight product={product} />
        </div>
      </div>
    )
  )
}

export default ProductDetail
