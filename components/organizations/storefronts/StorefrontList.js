import { useCallback, useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { gql, useQuery } from '@apollo/client'
import InfiniteScroll from 'react-infinite-scroll-component'
import { FilterContext } from '../../context/FilterContext'
import { OrganizationFilterContext } from '../../context/OrganizationFilterContext'
import { Loading, Error } from '../../shared/FetchStatus'
import NotFound from '../../shared/NotFound'
import StorefrontCard from './StorefrontCard'

/* Default number of elements coming from graphql query. */
const DEFAULT_PAGE_SIZE = 20

const ORGANIZATIONS_QUERY = gql`
  query SearchStorefronts(
    $first: Int
    $after: String
    $sectors: [String!]
    $countries: [String!]
    $buildingBlocks: [String!]
    $specialties: [String!]
    $certifications: [String!]
    $search: String!
  ) {
    searchStorefronts(
      first: $first
      after: $after
      sectors: $sectors
      countries: $countries
      buildingBlocks: $buildingBlocks
      specialties: $specialties
      certifications: $certifications
      search: $search
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
        heroFile
        website
        specialties
        certifications
        sectors {
          id
          slug
          name
        }
      }
    }
  }
`

const StorefrontListQuery = () => {
  const { displayType, setResultCounts } = useContext(FilterContext)
  const { countries, sectors, specialties, buildingBlocks, certifications, search } = useContext(OrganizationFilterContext)

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data, fetchMore } = useQuery(ORGANIZATIONS_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      countries: countries.map(country => country.value),
      sectors: sectors.map(sector => sector.value),
      specialties: specialties.map(s => s.value),
      certifications: certifications.map(c => c.value),
      buildingBlocks: buildingBlocks.map(b => b.value),
      search
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first'
  })

  const handleLoadMore = () => {
    fetchMore({
      variables: {
        after: pageInfo.endCursor,
        first: DEFAULT_PAGE_SIZE,
        countries: countries.map(country => country.value),
        sectors: sectors.map(sector => sector.value),
        specialties: specialties.map(s => s.value),
        certifications: certifications.map(c => c.value),
        buildingBlocks: buildingBlocks.map(b => b.value),
        search
      }
    })
  }

  useEffect(() => {
    if (data) {
      setResultCounts(resultCounts => {
        return {
          ...resultCounts,
          ...{ [['filter.entity.storefronts']]: data.searchStorefronts.totalCount }
        }
      })
    }
  }, [data, setResultCounts])

  if (loading) {
    return <Loading />
  } else if (error && error.networkError) {
    return <Error />
  } else if (error && !error.networkError) {
    return <NotFound />
  }

  const { searchStorefronts: { nodes, pageInfo } } = data
  if (nodes.length <= 0) {
    return (
      <div className='py-4'>
        {format('noResults.entity', { entity: format('ui.storefront.label').toLowerCase() })}
      </div>
    )
  }

  const gridStyles = `grid ${displayType === 'card'
    ? 'grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'
    : 'grid-cols-1'
  }`

  return (
    <div style={{ minHeight: '50vh' }}>
      {
        displayType === 'list' &&
        <div className='flex flex-row my-3 px-4 gap-x-4'>
          <div className='text-sm font-semibold opacity-70'>
            {format('ui.organization.header').toUpperCase()}
          </div>
        </div>
      }
      <InfiniteScroll
        className='relative infinite-scroll-default-height'
        dataLength={nodes.length}
        next={handleLoadMore}
        hasMore={pageInfo.hasNextPage}
        loader={<div className='relative text-center mt-3'>{format('general.loadingData')}</div>}
      >
        <div className={gridStyles}>
          {nodes.map((organization, index) =>
            <StorefrontCard key={index} displayType={displayType} {...{ organization }} />
          )}
        </div>
      </InfiniteScroll>
    </div>
  )
}

export default StorefrontListQuery
