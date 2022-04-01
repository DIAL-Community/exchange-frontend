import { useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { gql, useQuery } from '@apollo/client'
import InfiniteScroll from 'react-infinite-scroll-component'
import { HiSortAscending } from 'react-icons/hi'
import { FilterContext } from '../context/FilterContext'
import { OrganizationFilterContext } from '../context/OrganizationFilterContext'
import { Loading, Error } from '../shared/FetchStatus'
import OrganizationCard from './OrganizationCard'

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

  const filterDisplayed = props.filterDisplayed
  const displayType = props.displayType
  const gridStyles = `grid ${displayType === 'card'
    ? `grid-cols-1 gap-4
       ${filterDisplayed ? 'md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'}`
    : 'grid-cols-1'
    }`

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
              <div
                className={`
                  hidden ${filterDisplayed ? 'xl:block' : 'lg:block'}
                  lg:col-span-6 text-sm font-semibold opacity-50
                `}
              >
                {format('sector.header').toUpperCase()}
                <HiSortAscending className='hidden ml-1 inline text-2xl' />
              </div>
            </div>
        }
        {
          props.organizationList.length > 0
            ? props.organizationList.map((organization) => (
              <OrganizationCard key={organization.id} listType={displayType} {...{ organization, filterDisplayed }} />
            ))
            : (
              <div className='col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 px-1'>
                {format('noResults.entity', { entity: format('organization.label').toLowerCase() })}
              </div>
            )
        }
      </div>
    </>
  )
}

const OrganizationListQuery = () => {
  const { resultCounts, filterDisplayed, displayType, setResultCounts } = useContext(FilterContext)
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
    }
  })

  const handleLoadMore = () => {
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

  useEffect(() => {
    if (data) {
      setResultCounts({
        ...resultCounts,
        ...{ [['filter.entity.organizations']]: data.searchOrganizations.totalCount }
      })
    }
  }, [data])

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error />
  }

  const { searchOrganizations: { nodes, pageInfo } } = data

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
