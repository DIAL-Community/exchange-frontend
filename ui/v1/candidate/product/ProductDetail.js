import { useRef } from 'react'
import { useQuery } from '@apollo/client'
import Breadcrumb from '../Breadcrumb'
import { CANDIDATE_PRODUCT_DETAIL_QUERY } from '../../shared/query/candidateProduct'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import ProductDetailRight from './ProductDetailRight'
import ProductDetailLeft from './ProductDetailLeft'

const ProductDetail = ({ slug }) => {
  const commentsSectionRef = useRef(null)

  const { loading, error, data } = useQuery(CANDIDATE_PRODUCT_DETAIL_QUERY, {
    variables: { slug }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.candidateProduct) {
    return <NotFound />
  }

  const { candidateProduct: product } = data

  const slugNameMapping = (() => {
    const map = {}
    map[product.slug] = product.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-spearmint text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3'>
          <ProductDetailLeft product={product} />
        </div>
        <div className='lg:basis-2/3'>
          <ProductDetailRight commentsSectionRef={commentsSectionRef} product={product} />
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
