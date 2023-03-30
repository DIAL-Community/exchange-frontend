import { useCallback, useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { FixedSizeGrid, FixedSizeList } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import InfiniteLoader from 'react-window-infinite-loader'
import { FilterContext } from '../context/FilterContext'
import { DatasetFilterContext } from '../context/DatasetFilterContext'
import { Loading, Error } from '../shared/FetchStatus'
import NotFound from '../shared/NotFound'
import { DATASETS_QUERY } from '../../queries/dataset'
import DatasetCard from './DatasetCard'

/* Default number of elements coming from graphql query. */
const DEFAULT_PAGE_SIZE = 20
/* Minimum width per dataset card. This will decide how many column we have in the page. */
/* The value is based on the minimum required to render Bahmni card. */
const MIN_PRODUCT_CARD_WIDTH = 260
/* Default height of the dataset card. */
const MIN_PRODUCT_CARD_HEIGHT = 320
/* Default spacing between dataset card in a row. This is 0.5 rem. */
const PRODUCT_CARD_GUTTER_SIZE = 16
/* Height of the dataset's single list element when viewing the list view. */
const MIN_PRODUCT_LIST_SIZE = 80

const DatasetListQuery = () => {
  const { displayType, setResultCounts } = useContext(FilterContext)
  const {
    origins, countries, sectors, organizations, sdgs, tags, datasetTypes, search
  } = useContext(DatasetFilterContext)

  const { locale } = useRouter()
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data, fetchMore } = useQuery(DATASETS_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      origins: origins.map(origin => origin.value),
      countries: countries.map(country => country.value),
      sectors: sectors.map(sector => sector.value),
      organizations: organizations.map(organization => organization.value),
      sdgs: sdgs.map(sdg => sdg.value),
      tags: tags.map(tag => tag.label),
      datasetTypes: datasetTypes.map(datasetType => datasetType.value),
      search
    },
    context: { headers: { 'Accept-Language': locale } },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first'
  })

  const handleLoadMore = () => {
    fetchMore({
      variables: {
        after: pageInfo.endCursor,
        first: DEFAULT_PAGE_SIZE,
        origins: origins.map(origin => origin.value),
        countries: countries.map(country => country.value),
        sectors: sectors.map(sector => sector.value),
        organizations: organizations.map(organization => organization.value),
        sdgs: sdgs.map(sdg => sdg.value),
        tags: tags.map(tag => tag.label),
        datasetTypes: datasetTypes.map(datasetType => datasetType.value),
        search
      }
    })
  }

  useEffect(() => {
    if (data) {
      setResultCounts(resultCounts => {
        return {
          ...resultCounts,
          ...{ [['filter.entity.datasets']]: data.searchDatasets.totalCount }
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

  const { searchDatasets: { nodes, pageInfo, totalCount } } = data
  if (nodes.length <= 0) {
    return (
      <div className='px-3 py-4'>
        {format('noResults.entity', { entity: format('dataset.label').toLowerCase() })}
      </div>
    )
  }

  const isDatasetLoaded = (index) => !pageInfo.hasNextPage || index < nodes.length

  return (
    <>
      {
        displayType === 'list' &&
          <div className='flex flex-row my-3 px-4 gap-x-4 text-sm font-semibold '>
            <div className='w-4/12 opacity-80'>
              {format('dataset.header').toUpperCase()}
            </div>
            <div className='hidden lg:block w-6/12 opacity-50'>
              {format('origin.header').toUpperCase()}
            </div>
            <div className='hidden lg:block ml-auto opacity-50'>
              {format('dataset.card.dataset').toUpperCase()}
            </div>
          </div>
      }
      <div className={`${displayType === 'card' && '-mr-4' }`} style={{ height: '80vh' }}>
        <AutoSizer>
          {({ height, width }) => (
            <InfiniteLoader
              isItemLoaded={isDatasetLoaded}
              itemCount={totalCount}
              loadMoreItems={handleLoadMore}
            >
              {({ onItemsRendered, ref }) => {
                let columnCount = Math.floor(width / MIN_PRODUCT_CARD_WIDTH)
                if (width < MIN_PRODUCT_CARD_WIDTH) {
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
                        rowHeight={MIN_PRODUCT_CARD_HEIGHT}
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
                          const dataset = nodes[currentIndex]

                          return (
                            <div
                              style={{
                                ...style,
                                left: style.left,
                                top: style.top,
                                width: style.width - PRODUCT_CARD_GUTTER_SIZE,
                                height: style.height - PRODUCT_CARD_GUTTER_SIZE
                              }}
                            >
                              {
                                currentIndex < nodes.length && dataset &&
                                <DatasetCard listType={displayType} dataset={dataset} />
                              }
                              {currentIndex < nodes.length && !dataset && <Loading />}
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
                        itemSize={(MIN_PRODUCT_LIST_SIZE)}
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
                          const dataset = nodes[index]

                          return (
                            <div style={style}>
                              {index < nodes.length && dataset &&
                                <DatasetCard listType={displayType} dataset={dataset} />
                              }
                              {index < nodes.length && !dataset && <Loading />}
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

export default DatasetListQuery
