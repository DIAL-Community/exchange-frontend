import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { gql, useQuery } from '@apollo/client'
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
      description
      website
      rejected
    }
  }
}
`

const OrganizationList = (props) => {
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
            <div className='grid grid-cols-12 gap-4 my-3 px-4'>
              <div className='col-span-4 ml-2 text-sm font-semibold opacity-70'>
                {format('organization.header').toUpperCase()}
                <HiSortAscending className='hidden ml-1 inline text-2xl' />
              </div>
              <div className='hidden md:block col-span-4 text-sm font-semibold opacity-50'>
                {format('candidateOrganization.website').toUpperCase()}
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
  const format = (id, values) => formatMessage({ id }, { ...values })

  const { search } = useContext(OrganizationFilterContext)
  const { filterDisplayed, resultCounts, displayType, setResultCounts } = useContext(FilterContext)

  const { loading, error, data, fetchMore } = useQuery(ORGANIZATIONS_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      search: search
    },
    onCompleted: (data) => {
      setResultCounts({ ...resultCounts, ...{ [['filter.entity.candidateOrganizations']]: data.searchCandidateOrganizations.totalCount } })
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
      className='relative px-2 mt-3 pb-8 max-w-catalog mx-auto infinite-scroll-default-height'
      dataLength={nodes.length}
      next={handleLoadMore}
      hasMore={pageInfo.hasNextPage}
      loader={<div className='relative text-center mt-3'>{format('general.loadingData')}</div>}
    >
      <OrganizationList organizationList={nodes} displayType={displayType} filterDisplayed={filterDisplayed} />
    </InfiniteScroll>
  )
}

export default OrganizationListQuery
