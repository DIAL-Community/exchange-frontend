import { useCallback, useRef } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../../lib/apolloClient'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../../shared/GraphQueryHandler'
import { PRODUCT_SIMPLE_QUERY } from '../../../shared/query/productRepository'
import Breadcrumb from '../../shared/Breadcrumb'
import ProductRepositoryForm from './fragments/ProductRepositoryForm'
import ProductRepositoryEditLeft from './ProductRepositoryEditLeft'

const ProductRepositoryCreate = ({ productSlug }) => {
  const scrollRef = useRef(null)

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data } = useQuery(PRODUCT_SIMPLE_QUERY, {
    variables: { productSlug },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.CREATING
      }
    }
  })

  if (loading) {
    return handleLoadingQuery()
  } else if (error) {
    return handleQueryError(error)
  } else if (!data?.product) {
    return handleMissingData()
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
