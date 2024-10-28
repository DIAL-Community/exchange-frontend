import { useRef } from 'react'
import { useApolloClient, useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import Breadcrumb from '../../shared/Breadcrumb'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../shared/GraphQueryHandler'
import { CANDIDATE_PRODUCT_DETAIL_QUERY, CANDIDATE_PRODUCT_POLICY_QUERY } from '../../shared/query/candidateProduct'
import { fetchOperationPolicies } from '../../utils/policy'
import ProductDetailLeft from './ProductDetailLeft'
import ProductDetailRight from './ProductDetailRight'

const ProductDetail = ({ slug }) => {
  const scrollRef = useRef(null)
  const client = useApolloClient()

  const policies = fetchOperationPolicies(
    client,
    CANDIDATE_PRODUCT_POLICY_QUERY,
    ['editing']
  )

  const editingAllowed = policies['editing']

  const { loading, error, data, refetch } = useQuery(CANDIDATE_PRODUCT_DETAIL_QUERY, {
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
  } else if (!data?.candidateProduct) {
    return handleMissingData()
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
          <ProductDetailLeft scrollRef={scrollRef} product={product} />
        </div>
        <div className='lg:basis-2/3'>
          <ProductDetailRight
            ref={scrollRef}
            product={product}
            refetch={refetch}
            editingAllowed={editingAllowed}
          />
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
