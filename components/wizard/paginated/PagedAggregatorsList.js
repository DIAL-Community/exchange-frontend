import { gql, useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'
import OrganizationCard from '../../organizations/OrganizationCard'
import { Loading, Error } from '../../shared/FetchStatus'

const DEFAULT_PAGE_SIZE = 5
const AGGREGATORS_QUERY = gql`
  query PaginatedAggregators(
    $first: Int!,
    $offset: Int!,
    $countries: [String!],
    $services: [String!],
    $search: String!
  ) {
    paginatedAggregators(
      first: $first,
      offsetAttributes: { offset: $offset},
      countries: $countries,
      services: $services,
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
        name
        slug
        imageFile
        website
      }
    }
  }
`

const PagedAggregatorsList = ({ countries, services }) => {
  const [itemOffset, setItemOffset] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const { loading, error, data, fetchMore } = useQuery(AGGREGATORS_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      offset: itemOffset,
      countries: countries,
      services: services,
      search: ''
    }
  })

  useEffect(() => {
    if (itemOffset) {
      fetchMore({
        variables: {
          first: DEFAULT_PAGE_SIZE,
          offset: itemOffset,
          countries: countries,
          services: services,
          search: ''
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
      {
        data.paginatedAggregators.nodes && data.paginatedAggregators.nodes.map((organization) => {
          return (<OrganizationCard key={organization.name} organization={organization} listType='list' newTab />)
        })
      }
      <ReactPaginate
        breakLabel='...'
        nextLabel='Next >'
        forcePage={currentPage}
        onPageChange={handlePageClick}
        pageRangeDisplayed={1}
        pageCount={Math.ceil((itemOffset + data.paginatedAggregators.totalCount) / DEFAULT_PAGE_SIZE)}
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

export default PagedAggregatorsList
