import { useRef } from 'react'
import { useQuery } from '@apollo/client'
import { PRODUCT_DETAIL_QUERY } from '../../../shared/query/product'
import Breadcrumb from '../../shared/Breadcrumb'
import { Error, Loading, NotFound } from '../../../shared/FetchStatus'
import ProductDetailRight from './ProductDetailRight'
import ProductDetailLeft from './ProductDetailLeft'

const ProductDetail = ({ slug }) => {
  const scrollRef = useRef(null)

  const { loading, error, data } = useQuery(PRODUCT_DETAIL_QUERY, {
    variables: { slug }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.product) {
    return <NotFound />
  }

  const { product } = data

  const slugNameMapping = (() => {
    const map = {}
    map[product.slug] = product.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className="py-6 text-dial-stratos z-40">
        <Breadcrumb slugNameMapping={slugNameMapping}/>
        <hr className="border-b border-health-gray my-3"/>
      </div>

      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3'>
          <ProductDetailLeft scrollRef={scrollRef} product={product}/>
        </div>
        <div className='lg:basis-2/3'>
          <ProductDetailRight ref={scrollRef} product={product}/>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
