import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import InfiniteScroll from 'react-infinite-scroll-component'
import { HiSortAscending } from 'react-icons/hi'

import ProductCard from './ProductCard'
import { ProductFilterContext } from '../../context/candidate/ProductFilterContext'
import { FilterContext } from '../../context/FilterContext'
import { Loading, Error } from '../../shared/FetchStatus'

const DEFAULT_PAGE_SIZE = 20

const PRODUCTS_QUERY = gql`
query SearchCandidateProducts(
  $first: Int,
  $after: String,
  $search: String!
  ) {
  searchCandidateProducts(
    first: $first,
    after: $after,
    search: $search
  ) {
    __typename
    totalCount
    pageInfo {
      endCursor
      startCursor
      hasPreviousPage
      hasNextPage
    }
    nodes {
      id
      slug
      name
      website
      description
      submitterEmail
      repository
      rejected
    }
  }
}
`

const ProductList = (props) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const displayType = props.displayType
  const filterDisplayed = props.filterDisplayed
  const gridStyles = `grid ${displayType === 'card'
    ? `grid-cols-1 gap-4
       ${filterDisplayed ? 'lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3' : 'md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'}`
    : 'grid-cols-1'
    }`

  return (
    <>
      <div className={gridStyles}>
        {
          displayType === 'list' &&
            <div className='grid grid-cols-12 gap-x-4 my-3 px-4'>
              <div className='col-span-3 ml-2 text-sm font-semibold opacity-70'>
                {format('product.header').toUpperCase()}
                <HiSortAscending className='hidden ml-1 inline text-2xl' />
              </div>
              <div className='hidden xl:blockcol-span-3 text-sm font-semibold opacity-50'>
                {format('product.website').toUpperCase()}
                <HiSortAscending className='hidden ml-1 inline text-2xl' />
              </div>
            </div>
        }
        {
          props.productList.length > 0
            ? props.productList.map((product) => (
              <ProductCard key={product.id} listType={displayType} {...{ filterDisplayed, product }} />
              ))
            : (
              <div className='flex justify-self-center text-dial-gray-dark'>{
                format('noResults.entity', { entity: format('products.label') })
              }
              </div>
              )
        }
      </div>
    </>
  )
}

const ProductListQuery = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const { search } = useContext(ProductFilterContext)
  const { filterDisplayed, resultCounts, displayType, setResultCounts } = useContext(FilterContext)

  const { loading, error, data, fetchMore } = useQuery(PRODUCTS_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      search: search
    },
    onCompleted: (data) => {
      setResultCounts({ ...resultCounts, ...{ [['filter.entity.candidateProducts']]: data.searchCandidateProducts.totalCount } })
    }
  })

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error />
  }

  const { searchCandidateProducts: { nodes, pageInfo } } = data

  function handleLoadMore () {
    fetchMore({
      variables: {
        first: DEFAULT_PAGE_SIZE,
        after: pageInfo.endCursor,
        search: search
      }
    })
  }
  return (
    <InfiniteScroll
      className='relative px-2 mt-3 pb-8 max-w-catalog mx-auto'
      dataLength={nodes.length}
      next={handleLoadMore}
      hasMore={pageInfo.hasNextPage}
      loader={<div className='relative text-center mt-3'>{format('general.loadingData')}</div>}
    >
      <ProductList productList={nodes} displayType={displayType} filterDisplayed={filterDisplayed} />
    </InfiniteScroll>
  )
}

export default ProductListQuery
