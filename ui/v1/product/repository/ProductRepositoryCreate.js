import { useCallback, useRef } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import Breadcrumb from '../../shared/Breadcrumb'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { PRODUCT_SIMPLE_QUERY } from '../../shared/query/productRepository'
import ProductRepositoryForm from './fragments/ProductRepositoryForm'
import ProductRepositoryEditLeft from './ProductRepositoryEditLeft'

const ProductRepositoryCreate = ({ productSlug }) => {
  const scrollRef = useRef(null)

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data } = useQuery(PRODUCT_SIMPLE_QUERY, {
    variables: { productSlug }
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
    const map = {
      create: format('app.create')
    }
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
          <ProductRepositoryEditLeft product={product} scrollRef={scrollRef}/>
        </div>
        <div className='lg:basis-2/3'>
          <ProductRepositoryForm product={product} ref={scrollRef} />
        </div>
      </div>
    </div>
  )
}

export default ProductRepositoryCreate
