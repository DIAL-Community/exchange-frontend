import { useCallback, useRef } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { PRODUCT_REPOSITORY_DETAIL_QUERY } from '../../../shared/query/productRepository'
import Breadcrumb from '../../shared/Breadcrumb'
import { Error, Loading, NotFound } from '../../../shared/FetchStatus'
import ProductRepositoryForm from './fragments/ProductRepositoryForm'
import ProductRepositoryEditLeft from './ProductRepositoryEditLeft'

const ProductRepositoryEdit = ({ productSlug, repositorySlug }) => {
  const scrollRef = useRef(null)

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data } = useQuery(PRODUCT_REPOSITORY_DETAIL_QUERY, {
    variables: { productSlug, repositorySlug }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.product) {
    return <NotFound />
  }

  const { product, productRepository } = data

  const slugNameMapping = (() => {
    const map = {
      edit: format('app.edit')
    }
    map[product.slug] = product.name
    map[productRepository.slug] = productRepository.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-blue-chalk text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3'>
          <ProductRepositoryEditLeft product={product} scrollRef={scrollRef} />
        </div>
        <div className='lg:basis-2/3'>
          <ProductRepositoryForm
            ref={scrollRef}
            product={product}
            productRepository={productRepository}
          />
        </div>
      </div>
    </div>
  )
}

export default ProductRepositoryEdit
