import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { PRODUCT_DETAIL_QUERY } from '../../shared/query/product'
import Breadcrumb from '../../shared/Breadcrumb'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import ProductForm from './fragments/ProductForm'
import ProductEditLeft from './ProductEditLeft'

const ProductEdit = ({ slug }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

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
    const map = {
      edit: format('app.edit')
    }
    map[product.slug] = data.product.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-blue-chalk text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row'>
        <div className='lg:basis-1/3'>
          <ProductEditLeft product={product} />
        </div>
        <div className='lg:basis-2/3'>
          <ProductForm product={product} />
        </div>
      </div>
    </div>
  )
}

export default ProductEdit
