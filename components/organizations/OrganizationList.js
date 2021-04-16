import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import InfiniteScroll from 'react-infinite-scroll-component'

import OrganizationCard from './OrganizationCard'
import { OrganizationFilterContext } from '../context/OrganizationFilterContext'
import { FilterResultContext, convertToKey } from '../context/FilterResultContext'
import { HiSortAscending } from 'react-icons/hi'

const DEFAULT_PAGE_SIZE = 20

const ORGANIZATIONS_QUERY = gql`
query SearchOrganizations(
  $first: Int,
  $after: String,
  $sectors: [String!],
  $countries: [String!]
  ) {
  searchOrganizations(
    first: $first,
    after: $after,
    sectors: $sectors,
    countries: $countries
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
  const displayType = props.displayType
  const gridStyles = `grid ${displayType === 'card' ? 'grid-cols-4 gap-4' : 'grid-cols-1'}`

  return (
    <>
      <div className={gridStyles}>
        {
          displayType === 'list' &&
            <div className='grid grid-cols-12 my-3 text-dial-gray-dark px-4'>
              <div className='col-span-4 ml-2 text-sm font-semibold opacity-80'>
                {'Organizations'.toUpperCase()}
                <HiSortAscending className='ml-1 inline text-2xl' />
              </div>
              <div className='col-span-6 text-sm font-semibold opacity-50'>
                {'Sectors'.toUpperCase()}
                <HiSortAscending className='ml-1 inline text-2xl' />
              </div>
              <div className='col-span-2 text-sm font-semibold opacity-50' />
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
  const { resultCounts, setResultCounts } = useContext(FilterResultContext)
  const { countries, sectors, search, displayType } = useContext(OrganizationFilterContext)

  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const { loading, error, data, fetchMore } = useQuery(ORGANIZATIONS_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      countries: countries.map(country => country.value),
      sectors: sectors.map(sector => sector.value),
      search: search
    },
    onCompleted: (data) => {
      setResultCounts({ ...resultCounts, ...{ [`${convertToKey('Organizations')}`]: data.searchOrganizations.totalCount } })
    }
  })

  if (loading) {
    return <div className='relative text-center my-3'>{format('general.fetchingData')}</div>
  }

  if (error) {
    return <div className='relative text-center my-3'>{format('general.fetchError')}</div>
  }

  const { searchOrganizations: { nodes, pageInfo } } = data

  function handleLoadMore () {
    fetchMore({
      variables: {
        after: pageInfo.endCursor,
        first: DEFAULT_PAGE_SIZE,
        countries: countries.map(country => country.value),
        sectors: sectors.map(sector => sector.value),
        search: search
      }
    })
  }
  return (
    <InfiniteScroll
      className='relative mx-2 mt-3'
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
