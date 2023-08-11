import { useCallback, useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { gql, useQuery } from '@apollo/client'
import { FixedSizeGrid, FixedSizeList } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import InfiniteLoader from 'react-window-infinite-loader'
import { FilterContext } from '../context/FilterContext'
import { OrganizationFilterContext } from '../context/OrganizationFilterContext'
import { Loading, Error } from '../shared/FetchStatus'
import NotFound from '../shared/NotFound'
import OrganizationCard from './OrganizationCard'

/* Default number of elements coming from graphql query. */
const DEFAULT_PAGE_SIZE = 20
/* Minimum width per product card. This will decide how many column we have in the page. */
/* The value is based on the minimum required to render Bahmni card. */
const MIN_ORGANIZATION_CARD_WIDTH = 280
/* Default height of the product card. */
const MIN_ORGANIZATION_CARD_HEIGHT = 310
/* Default spacing between product card in a row. This is 0.5 rem. */
const ORGANIZATION_CARD_GUTTER_SIZE = 16
/* Height of the product's single list element when viewing the list view. */
const MIN_ORGANIZATION_LIST_SIZE = 80

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

const OrganizationListQuery = () => {
  const { displayType, setResultCounts } = useContext(FilterContext)
  const { aggregator, endorser, endorserLevel, countries, sectors, years, search } = useContext(OrganizationFilterContext)

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data, fetchMore } = useQuery(ORGANIZATIONS_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      countries: countries.map(country => country.value),
      sectors: sectors.map(sector => sector.value),
      years: years.map(year => year.value),
      aggregatorOnly: aggregator,
      endorserOnly: endorser,
      endorserLevel,
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
        years: years.map(year => year.value),
        aggregatorOnly: aggregator,
        endorserOnly: endorser,
        endorserLevel,
        search
      }
    })
  }

  useEffect(() => {
    if (data) {
      setResultCounts(resultCounts => {
        return {
          ...resultCounts,
          ...{ [['filter.entity.organizations']]: data.searchOrganizations.totalCount }
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

  const { searchOrganizations: { nodes, pageInfo, totalCount } } = data
  if (nodes.length <= 0) {
    return (
      <div className='px-3 py-4'>
        {format('noResults.entity', { entity: format('ui.organization.label').toLowerCase() })}
      </div>
    )
  }

  const isProductLoaded = (index) => !pageInfo.hasNextPage || index < nodes.length

  return (
    <>
      {
        displayType === 'list' &&
        <div className='flex flex-row my-3 px-4 gap-x-4'>
          <div className='text-sm font-semibold opacity-70'>
            {format('ui.organization.header').toUpperCase()}
          </div>
        </div>
      }
      <div className={`${displayType === 'card' && '-mr-4'}`} style={{ height: 'calc(100vh + 600px)' }}>
        <AutoSizer>
          {({ height, width }) => (
            <InfiniteLoader
              isItemLoaded={isProductLoaded}
              itemCount={totalCount}
              loadMoreItems={handleLoadMore}
            >
              {({ onItemsRendered, ref }) => {
                let columnCount = Math.floor(width / MIN_ORGANIZATION_CARD_WIDTH)
                if (width < MIN_ORGANIZATION_CARD_WIDTH) {
                  columnCount = 1
                }

                return (
                  <>
                    {
                      displayType === 'card' &&
                        <FixedSizeGrid
                          className='no-scrollbars'
                          height={height}
                          width={(width)}
                          rowHeight={MIN_ORGANIZATION_CARD_HEIGHT}
                          columnWidth={width / columnCount}
                          rowCount={Math.floor(totalCount / columnCount) + 1}
                          columnCount={columnCount}
                          onItemsRendered={({
                            overscanColumnStartIndex,
                            overscanColumnStopIndex,
                            overscanRowStartIndex,
                            overscanRowStopIndex,
                            visibleColumnStartIndex,
                            visibleColumnStopIndex,
                            visibleRowStartIndex,
                            visibleRowStopIndex
                          }) => {
                            onItemsRendered({
                              overscanStartIndex: overscanColumnStartIndex + overscanRowStartIndex * columnCount,
                              overscanStopIndex: overscanColumnStopIndex + overscanRowStopIndex * columnCount,
                              visibleStartIndex: visibleColumnStartIndex + visibleRowStartIndex * columnCount,
                              visibleStopIndex: visibleColumnStopIndex + visibleRowStopIndex * columnCount
                            })
                          }}
                          ref={ref}
                        >
                          {({ columnIndex, rowIndex, style }) => {
                            const currentIndex = rowIndex * columnCount + columnIndex
                            const organization = nodes[currentIndex]

                            return (
                              <div
                                style={{
                                  ...style,
                                  width: style.width - ORGANIZATION_CARD_GUTTER_SIZE,
                                  height: style.height - ORGANIZATION_CARD_GUTTER_SIZE
                                }}
                              >
                                {
                                  currentIndex < nodes.length && organization &&
                                    <OrganizationCard listType={displayType} {...{ organization }} />
                                }
                                {currentIndex < nodes.length && !organization && <Loading />}
                              </div>
                            )
                          }}
                        </FixedSizeGrid>
                    }
                    {
                      displayType === 'list' &&
                        <FixedSizeList
                          className='no-scrollbars'
                          height={height}
                          width={(width)}
                          itemSize={(MIN_ORGANIZATION_LIST_SIZE)}
                          columnWidth={width / columnCount}
                          itemCount={totalCount}
                          onItemsRendered={({
                            overscanStartIndex,
                            overscanStopIndex,
                            visibleStartIndex,
                            visibleStopIndex
                          }) => {
                            onItemsRendered({
                              overscanStartIndex,
                              overscanStopIndex,
                              visibleStartIndex,
                              visibleStopIndex
                            })
                          }}
                          ref={ref}
                        >
                          {({ index, style }) => {
                            const organization = nodes[index]

                            return (
                              <div style={style}>
                                {
                                  index < nodes.length && organization &&
                                    <OrganizationCard listType={displayType} {...{ organization }} />
                                }
                                {index < nodes.length && !organization && <Loading />}
                              </div>
                            )
                          }}
                        </FixedSizeList>
                    }
                  </>
                )
              }}
            </InfiniteLoader>
          )}
        </AutoSizer>
      </div>
    </>
  )
}

export default OrganizationListQuery
