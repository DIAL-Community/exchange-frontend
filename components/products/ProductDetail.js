import { useQuery } from '@apollo/client'
import { useEffect } from 'react'
import NotFound from '../shared/NotFound'
import { Error, Loading } from '../shared/FetchStatus'
import { PRODUCT_QUERY } from '../../queries/product'
import ProductDetailLeft from './ProductDetailLeft'
import ProductDetailRight from './ProductDetailRight'

const ProductDetail = ({ slug, locale }) => {

  const { loading, error, data, refetch } = useQuery(PRODUCT_QUERY, {
    variables: { slug },
    context: { headers: { 'Accept-Language': locale } },
    skip: !slug
  })

  useEffect(() => {
    refetch()
  }, [locale, refetch])

  return (
    <>
      {loading && <Loading />}
      {error && error.networkError && <Error />}
      {error && !error.networkError && <NotFound />}
      {
        data && data.product &&
          <div className='flex flex-col lg:flex-row justify-between pb-8 max-w-catalog mx-auto'>
            <div className='relative lg:sticky lg:top-66px w-full lg:w-1/3 xl:w-1/4 h-full py-4 px-4'>
              <ProductDetailLeft product={data.product} />
            </div>
            <div className='w-full lg:w-2/3 xl:w-3/4'>
              <ProductDetailRight product={data.product} />
            </div>
          </div>
      }
    </>
  )
}

export default ProductDetail
