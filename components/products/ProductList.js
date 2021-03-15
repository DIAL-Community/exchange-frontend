import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import InfiniteScroll from 'react-infinite-scroll-component'

import ProductCard from './ProductCard'

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
      <div className='row flex flex-wrap grid grid-cols-4 gap-3'>
        {props.productList.map((product) => {
          return <ProductCard key={product.id} product={product} />
        })}
      </div>
    </>
  )
}

const ProductListQuery = () => {
  const { loading, error, data, fetchMore } = useQuery(PRODUCTS_QUERY, { variables: { first: 20 } })
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
      },
      updateQuery (previousResult, { fetchMoreResult }) {
        const connection = fetchMoreResult.products

        return {
          products: {
            pageInfo: connection.pageInfo,
            nodes: [...previousResult.products.nodes, ...connection.nodes],
            __typename: previousResult.products.__typename
          }
        }
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
      <div id='content' className='container-fluid with-header' >
        <ProductList productList={nodes} />
      </div>
    </InfiniteScroll>
  )
}

export default ProductListQuery
