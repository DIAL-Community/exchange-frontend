import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import InfiniteScroll from 'react-infinite-scroll-component'

import OrganizationCard from './OrganizationCard'
import { OrganizationFilterContext } from '../context/OrganizationFilterContext'
import { FilterContext } from '../context/FilterContext'
import { HiSortAscending } from 'react-icons/hi'
import { Loading, Error } from '../shared/FetchStatus'

const DEFAULT_PAGE_SIZE = 20

const ORGANIZATIONS_QUERY = gql`
query SearchOrganizations(
    $first: Int,
    $after: String,
    $aggregatorOnly: Boolean,
    $endorserOnly: Boolean,
    $endorserLevel: String!,
    $sectors: [String!],
    $countries: [String!],
    $years: [Int!],
    $search: String!
  ) {
  searchOrganizations(
    first: $first,
    after: $after,
    aggregatorOnly: $aggregatorOnly,
    endorserOnly: $endorserOnly,
    endorserLevel: $endorserLevel,
    sectors: $sectors,
    countries: $countries,
    years: $years,
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
      whenEndorsed
      website
      sectors {
        id
        slug
        name
      }
    }
  }
}
`

const OrganizationList = (props) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const displayType = props.displayType
  const gridStyles = `grid ${displayType === 'card' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4' : 'grid-cols-1'}`

  return (
    <>
      <div className={gridStyles}>
        {
          displayType === 'list' &&
            <div className='grid grid-cols-12 my-3 text-dial-gray-dark px-4'>
              <div className='col-span-10 lg:col-span-4 ml-2 text-sm font-semibold opacity-80'>
                {format('organization.header').toUpperCase()}
                <HiSortAscending className='hidden ml-1 inline text-2xl' />
              </div>
              <div className='hidden lg:block lg:col-span-6 text-sm font-semibold opacity-50'>
                {format('sector.header').toUpperCase()}
                <HiSortAscending className='hidden ml-1 inline text-2xl' />
              </div>
            </div>
        }
        {
          props.organizationList.map((organization) => (
            <OrganizationCard key={organization.id} organization={organization} listType={displayType} />
          ))
        }
      </div>
    </>
  )
}

const OrganizationListQuery = () => {
  const { resultCounts, displayType, setResultCounts } = useContext(FilterContext)
  const { aggregator, endorser, endorserLevel, countries, sectors, years, search } = useContext(OrganizationFilterContext)

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const { loading, error, data, fetchMore } = useQuery(ORGANIZATIONS_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      countries: countries.map(country => country.value),
      sectors: sectors.map(sector => sector.value),
      years: years.map(year => year.value),
      aggregatorOnly: aggregator,
      endorserOnly: endorser,
      endorserLevel: endorserLevel,
      search: search
    },
    onCompleted: (data) => {
      setResultCounts({ ...resultCounts, ...{ [['filter.entity.organizations']]: data.searchOrganizations.totalCount } })
    }
  })

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error />
  }

  const { searchOrganizations: { nodes, pageInfo } } = data

  function handleLoadMore () {
    fetchMore({
      variables: {
        after: pageInfo.endCursor,
        first: DEFAULT_PAGE_SIZE,
        countries: countries.map(country => country.value),
        sectors: sectors.map(sector => sector.value),
        years: years.map(year => year.value),
        aggregatorOnly: aggregator,
        endorserOnly: endorser,
        endorserLevel: endorserLevel,
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
