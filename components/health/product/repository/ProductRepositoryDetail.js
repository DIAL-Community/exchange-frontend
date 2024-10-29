import { useRef, useState } from 'react'
import { useApolloClient, useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../../lib/apolloClient'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../../shared/GraphQueryHandler'
import { PRODUCT_POLICY_QUERY } from '../../../shared/query/product'
import { PRODUCT_REPOSITORY_DETAIL_QUERY } from '../../../shared/query/productRepository'
import { fetchOperationPolicies } from '../../../utils/policy'
import Breadcrumb from '../../shared/Breadcrumb'
import ProductRepositoryDetailLeft from './ProductRepositoryDetailLeft'
import ProductRepositoryDetailRight from './ProductRepositoryDetailRight'

const ProductRepositoryDetail = ({ productSlug, repositorySlug }) => {
  const scrollRef = useRef(null)
  const client = useApolloClient()

  const [editingAllowed, setEditingAllowed] = useState(false)

  const { loading, error, data } = useQuery(PRODUCT_REPOSITORY_DETAIL_QUERY, {
    variables: { productSlug, repositorySlug },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  if (loading) {
    return handleLoadingQuery
  } else if (error) {
    return handleQueryError(error)
  } else if (!data?.productRepository || !data?.product) {
    return handleMissingData()
  }

  const { product, productRepository } = data

  fetchOperationPolicies(
    client,
    PRODUCT_POLICY_QUERY,
    ['editing']
  ).then(policies => {
    setEditingAllowed(policies['editing'])
  })

  const slugNameMapping = (() => {
    const map = {}
    map[product.slug] = product.name
    map[productRepository.slug] = productRepository.name

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
          <ProductRepositoryDetailLeft
            scrollRef={scrollRef}
            product={product}
            productRepository={productRepository}
          />
        </div>
        <div className='lg:basis-2/3'>
          <ProductRepositoryDetailRight
            ref={scrollRef}
            product={product}
            productRepository={productRepository}
            editingAllowed={editingAllowed}
          />
        </div>
      </div>
    </div>
  )
}

export default ProductRepositoryDetail
