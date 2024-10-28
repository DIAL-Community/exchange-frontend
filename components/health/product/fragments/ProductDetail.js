import { useRef } from 'react'
import { useApolloClient, useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../../lib/apolloClient'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../../shared/GraphQueryHandler'
import { PRODUCT_DETAIL_QUERY, PRODUCT_POLICY_QUERY } from '../../../shared/query/product'
import { fetchOperationPolicies } from '../../../utils/policy'
import Breadcrumb from '../../shared/Breadcrumb'
import ProductDetailLeft from './ProductDetailLeft'
import ProductDetailRight from './ProductDetailRight'

const ProductDetail = ({ slug }) => {
  const scrollRef = useRef(null)
  const client = useApolloClient()

  const policies = fetchOperationPolicies(
    client,
    PRODUCT_POLICY_QUERY,
    ['editing', 'deleting']
  )

  const editingAllowed = policies['editing']
  const deletingAllowed = policies['deleting']

  const { loading, error, data } = useQuery(PRODUCT_DETAIL_QUERY, {
    variables: { slug },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
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
    const map = {}
    map[product.slug] = product.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className="py-6 text-dial-stratos z-40">
        <Breadcrumb slugNameMapping={slugNameMapping} />
        <hr className="border-b border-health-gray my-3" />
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3'>
          <ProductDetailLeft
            scrollRef={scrollRef}
            product={product}
          />
        </div>
        <div className='lg:basis-2/3'>
          <ProductDetailRight
            ref={scrollRef}
            product={product}
            editingAllowed={editingAllowed}
            deletingAllowed={deletingAllowed}
          />
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
