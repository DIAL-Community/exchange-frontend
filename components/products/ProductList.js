import { useCallback, useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { FixedSizeGrid, FixedSizeList } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import InfiniteLoader from 'react-window-infinite-loader'
import { FilterContext } from '../context/FilterContext'
import { ProductFilterContext } from '../context/ProductFilterContext'
import { Loading, Error } from '../shared/FetchStatus'
import NotFound from '../shared/NotFound'
import { PRODUCTS_QUERY } from '../../queries/product'
import ProductCard from './ProductCard'

/* Default number of elements coming from graphql query. */
const DEFAULT_PAGE_SIZE = 20
/* Minimum width per product card. This will decide how many column we have in the page. */
/* The value is based on the minimum required to render Bahmni card. */
const MIN_PRODUCT_CARD_WIDTH = 260
/* Default height of the product card. */
const MIN_PRODUCT_CARD_HEIGHT = 360
/* Default spacing between product card in a row. This is 1rem. */
/* Because we're adding this spacing, make sure the container right margin is offsetted by 1rem. */
const PRODUCT_CARD_GUTTER_SIZE = 16
/* Height of the product's single list element when viewing the list view. */
const MIN_PRODUCT_LIST_SIZE = 80

const ProductListQuery = () => {
  const { displayType, setResultCounts } = useContext(FilterContext)
  const {
    origins, countries, sectors, organizations, sdgs, tags, useCases, workflows, buildingBlocks,
    endorsers, productDeployable, isEndorsed, search, licenseTypes, isLinkedWithDpi
  } = useContext(ProductFilterContext)

  const { locale } = useRouter()
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data, fetchMore } = useQuery(PRODUCTS_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      origins: origins.map(origin => origin.value),
      countries: countries.map(country => country.value),
      sectors: sectors.map(sector => sector.value),
      organizations: organizations.map(organization => organization.value),
      sdgs: sdgs.map(sdg => sdg.value),
      tags: tags.map(tag => tag.label),
      useCases: useCases.map(useCase => useCase.value),
      workflows: workflows.map(workflow => workflow.value),
      buildingBlocks: buildingBlocks.map(buildingBlock => buildingBlock.value),
      endorsers: endorsers.map(endorser => endorser.value),
      licenseTypes: licenseTypes.map(licenseType => licenseType.value),
      productDeployable,
      isEndorsed,
      isLinkedWithDpi,
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
        useCases: useCases.map(useCase => useCase.value),
        workflows: workflows.map(workflow => workflow.value),
        buildingBlocks: buildingBlocks.map(buildingBlock => buildingBlock.value),
        endorsers: endorsers.map(endorser => endorser.value),
        licenseTypes: licenseTypes.map(licenseType => licenseType.value),
        productDeployable,
        isEndorsed,
        isLinkedWithDpi,
        search
      }
    })
  }

  useEffect(() => {
    if (data) {
      setResultCounts(resultCounts => {
        return {
          ...resultCounts,
          ...{ [['filter.entity.products']]: data.searchProducts.totalCount }
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

  const { searchProducts: { nodes, pageInfo, totalCount } } = data
  if (nodes.length <= 0) {
    return (
      <div className='px-3 py-4'>
        {format('noResults.entity', { entity: format('product.label').toLowerCase() })}
      </div>
    )
  }

  const isProductLoaded = (index) => !pageInfo.hasNextPage || index < nodes.length

  return (
    <>
      {
        displayType === 'list' &&
          <div className='flex flex-row my-3 px-4 gap-x-4'>
            <div className='w-4/12 text-sm font-semibold opacity-70'>
              {format('product.header').toUpperCase()}
            </div>
            <div className='hidden lg:block w-4/12 text-sm font-semibold opacity-50'>
              {format('origin.header').toUpperCase()}
            </div>
            <div className='hidden lg:block w-2/12 text-sm font-semibold opacity-50'>
              {format('product.license').toUpperCase()}
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
                let columnCount = Math.floor(width / MIN_PRODUCT_CARD_WIDTH)
                if (width < MIN_PRODUCT_CARD_WIDTH) {
                  columnCount = 1
                }

                // On grid, organize the element to match the column count.
                const onGridItemsRenderedHandler = ({
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
                }

                // On list, just go down the list of single column.
                const onListItemsRenderedHandler = ({
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
                        onItemsRendered={onGridItemsRenderedHandler}
                        ref={ref}
                      >
                        {({ columnIndex, rowIndex, style }) => {
                          const currentIndex = rowIndex * columnCount + columnIndex
                          const product = nodes[currentIndex]

                          return (
                            <div
                              style={{
                                ...style,
                                width: style.width - PRODUCT_CARD_GUTTER_SIZE,
                                height: style.height - PRODUCT_CARD_GUTTER_SIZE
                              }}
                            >
                              {
                                currentIndex < nodes.length && product &&
                                  <ProductCard listType={displayType} product={product} />
                              }
                              {currentIndex < nodes.length && !product && <Loading />}
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
                        onItemsRendered={onListItemsRenderedHandler}
                        ref={ref}
                      >
                        {({ index, style }) => {
                          const product = nodes[index]

                          return (
                            <div style={style}>
                              {
                                index < nodes.length && product &&
                                  <ProductCard listType={displayType} product={product} />
                              }
                              {index < nodes.length && !product && <Loading />}
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

export default ProductListQuery
