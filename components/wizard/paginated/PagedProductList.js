import { gql, useQuery } from '@apollo/client'
import { useIntl } from 'react-intl'
import { useCallback, useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'
import ProductCard from '../../products/ProductCard'
import { Loading, Error } from '../../shared/FetchStatus'
import { LicenseTypeFilter } from '../../../lib/utilities'

const DEFAULT_PAGE_SIZE = 5
const PRODUCTS_QUERY = gql`
  query PaginatedProducts(
    $first: Int!,
    $offset: Int!,
    $buildingBlocks: [String!],
    $countries: [String!],
    $sectors: [String!],
    $subSectors: [String!],
    $tags: [String!],
    $productSortHint: String!
    $commercialProduct: Boolean
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
      commercialProduct: $commercialProduct
    ) {
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
        endorsers {
          name
          slug
        }
        origins {
          name
          slug
        }
        isLaunchable
        commercialProduct
        mainRepository {
          license
        }
      }
    }
  }
`

const PagedProductList = ({ buildingBlocks, countries, sectors, subSectors, tags, productSortHint, licenseTypeFilter }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [itemOffset, setItemOffset] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const commercialProduct =
    licenseTypeFilter === LicenseTypeFilter.COMMERCIAL
      ? true
      : licenseTypeFilter === LicenseTypeFilter.OPEN_SOURCE
        ? false
        : null

  const { loading, error, data, fetchMore } = useQuery(PRODUCTS_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      offset: itemOffset,
      buildingBlocks,
      countries,
      sectors,
      subSectors,
      tags,
      productSortHint,
      commercialProduct
    }
  })

  useEffect(() => {
    setCurrentPage(0)
    setItemOffset(0)
  }, [licenseTypeFilter])

  useEffect(() => {
    fetchMore({
      variables: {
        first: DEFAULT_PAGE_SIZE,
        offset: itemOffset,
        buildingBlocks,
        countries,
        sectors,
        subSectors,
        tags,
        productSortHint,
        commercialProduct
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemOffset, commercialProduct])

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
        {data.paginatedProducts.nodes && data.paginatedProducts.nodes.length
          ? format('wizard.results.productsDesc')
          : format('wizard.results.noProducts')}
      </div>
      {
        data.paginatedProducts.nodes && data.paginatedProducts.nodes.map((product) => {
          return (<ProductCard key={product.id} product={product} listType='list' newTab />)
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
