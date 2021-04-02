import { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import InfiniteScroll from 'react-infinite-scroll-component'

import ProductCard from './ProductCard'
import { ProductFilterContext } from '../context/ProductFilterContext'

const DEFAULT_PAGE_SIZE = 20

const PRODUCTS_QUERY = gql`
query Products($first: Int, $after: String) {
  products(first: $first, after: $after) {
    pageInfo {
      endCursor
      startCursor
      hasPreviousPage
      hasNextPage
    }
    nodes {
      id
      name
      slug
      imageFile
      productDescriptions {
        description
      }
    }
  }
}
`

const ProductList = (props) => {
  return (
    <>
      <div className='row grid grid-cols-4 gap-3'>
        {props.productList.map((product) => {
          return <ProductCard key={product.id} product={product} />
        })}
      </div>
    </>
  )
}

const ProductListQuery = () => {
  const { withMaturity, origins } = useContext(ProductFilterContext)
  console.log('With maturity: ', withMaturity)
  console.log('Origins: ', origins)

  const { loading, error, data, fetchMore } = useQuery(PRODUCTS_QUERY, { variables: { first: DEFAULT_PAGE_SIZE } })
  if (loading) {
    return <div>Fetching..</div>
  }
  if (error) {
    return <div>Error!</div>
  }

  const { products: { nodes, pageInfo } } = data

  function handleLoadMore () {
    fetchMore({
      variables: {
        after: pageInfo.endCursor,
        first: DEFAULT_PAGE_SIZE
      }
    })
  }
  return (
    <InfiniteScroll
      dataLength={nodes.length}
      next={handleLoadMore}
      hasMore={pageInfo.hasNextPage}
      loader={<div>Loading...</div>}
    >
      <div id='content' className='container-fluid with-header p-3'>
        <ProductList productList={nodes} />
      </div>
    </InfiniteScroll>
  )
}

export default ProductListQuery
