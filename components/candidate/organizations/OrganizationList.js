import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import InfiniteScroll from 'react-infinite-scroll-component'
import { HiSortAscending } from 'react-icons/hi'

import OrganizationCard from './OrganizationCard'
import { OrganizationFilterContext } from '../../context/candidate/OrganizationFilterContext'
import { FilterContext } from '../../context/FilterContext'
import { Loading, Error } from '../../shared/FetchStatus'

const DEFAULT_PAGE_SIZE = 20

const ORGANIZATIONS_QUERY = gql`
query SearchCandidateOrganizations(
  $first: Int,
  $after: String,
  $search: String!
  ) {
  searchCandidateOrganizations(
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
      rejected
    }
  }
}
`

const OrganizationList = (props) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const displayType = props.displayType
  const gridStyles = `grid ${displayType === 'card' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4' : 'grid-cols-1'}`

  return (
    <>
      <div className={gridStyles}>
        {
          displayType === 'list' &&
            <div className='grid grid-cols-12 my-3 px-4'>
              <div className='col-span-5 ml-2 text-sm font-semibold opacity-70'>
                {format('organization.header').toUpperCase()}
                <HiSortAscending className='hidden ml-1 inline text-2xl' />
              </div>
              <div className='hidden md:block col-span-3 text-sm font-semibold opacity-50'>
                {format('organization.website').toUpperCase()}
                <HiSortAscending className='hidden ml-1 inline text-2xl' />
              </div>
            </div>
        }
        {
          props.organizationList.length > 0
            ? props.organizationList.map((organization) => (
              <OrganizationCard key={organization.id} organization={organization} listType={displayType} />
              ))
            : (
              <div className='flex justify-self-center text-dial-gray-dark'>{
                format('noResults.entity', { entity: format('organizations.label') })
              }
              </div>
              )
        }
      </div>
    </>
  )
}

const OrganizationListQuery = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const { displayType } = useContext(FilterContext)
  const { search } = useContext(OrganizationFilterContext)
  const { loading, error, data, fetchMore } = useQuery(ORGANIZATIONS_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      search: search
    }
  })

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error />
  }

  const { searchCandidateOrganizations: { nodes, pageInfo } } = data

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
      <OrganizationList organizationList={nodes} displayType={displayType} />
    </InfiniteScroll>
  )
}

export default OrganizationListQuery
