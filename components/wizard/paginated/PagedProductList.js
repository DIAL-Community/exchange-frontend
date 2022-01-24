import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { useIntl } from 'react-intl'

import { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'

import ProductCard from '../../products/ProductCard'
import { Loading, Error } from '../../shared/FetchStatus'

const DEFAULT_PAGE_SIZE = 5
const PRODUCTS_QUERY = gql`
  query PaginatedProducts(
    $first: Int,
    $offset: Int,
    $buildingBlocks: [String!],
    $countries: [String!],
    $sectors: [String!],
    $subSectors: [String!],
    $tags: [String!],
    $productSortHint: String!
  ) {
    paginatedProducts(
      first: $first,
      offsetAttributes: { offset: $offset},
      buildingBlocks: $buildingBlocks,
      countries: $countries,
      sectors: $sectors,
      subSectors: $subSectors,
      tags: $tags,
      productSortHint: $productSortHint
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
        name
        slug
        imageFile
        website
      }
    }
  }
`

const PagedProductList = ({ buildingBlocks, countries, sectors, subSectors, tags, productSortHint }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const [itemOffset, setItemOffset] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const { loading, error, data, fetchMore } = useQuery(PRODUCTS_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      offset: itemOffset,
      buildingBlocks: buildingBlocks,
      countries: countries,
      sectors: sectors,
      subSectors: subSectors,
      tags: tags,
      productSortHint: productSortHint
    }
  })

  useEffect(() => {
    if (itemOffset) {
      fetchMore({
        variables: {
          first: DEFAULT_PAGE_SIZE,
          offset: itemOffset,
          buildingBlocks: buildingBlocks,
          countries: countries,
          sectors: sectors,
          subSectors: subSectors,
          tags: tags,
          productSortHint: productSortHint
        }
      })
    }
  }, [itemOffset])

  const handlePageClick = (event) => {
    setCurrentPage(event.selected)
    setItemOffset(event.selected * DEFAULT_PAGE_SIZE)
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error />
  }

  return (
    <>
      <div className='pb-4 text-sm'>
        {data.paginatedProducts.nodes && data.paginatedProducts.nodes.length ? format('wizard.results.productsDesc') : format('wizard.results.noProducts')}
      </div>
      {
        data.paginatedProducts.nodes && data.paginatedProducts.nodes.map((product) => {
          return (<ProductCard key={product.name} product={product} listType='list' newTab />)
        })
      }
      <ReactPaginate
        breakLabel='...'
        nextLabel='Next >'
        forcePage={currentPage}
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={Math.ceil((itemOffset + data.paginatedProducts.totalCount) / DEFAULT_PAGE_SIZE)}
        previousLabel='< Previous'
        renderOnZeroPageCount={null}
        breakLinkClassName='relative block py-1.5 px-3 border border-dial-gray -ml-px'
        containerClassName='flex mb-3 mt-3 ml-auto border-3 border-transparent'
        pageLinkClassName='relative block py-1.5 px-3 border border-dial-gray -ml-px'
        activeLinkClassName='bg-dial-yellow border-dial-yellow'
        previousLinkClassName='relative block py-1.5 px-3 border border-dial-gray'
        nextLinkClassName='relative block py-1.5 px-3 border border-dial-gray -ml-px'
        disabledLinkClassName='text-dial-gray'
      />
    </>
  )
}

export default PagedProductList
