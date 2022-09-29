import { useCallback, useContext } from 'react'
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
const MIN_PRODUCT_CARD_WIDTH = 380
/* Default height of the product card. */
const MIN_PRODUCT_CARD_HEIGHT = 540
/* Default spacing between product card in a row. This is 0.5 rem. */
const PRODUCT_CARD_GUTTER_SIZE = 8
/* Height of the product's single list element when viewing the list view. */
const MIN_PRODUCT_LIST_SIZE = 80

const ProductListQuery = () => {
  const { resultCounts, filterDisplayed, displayType, setResultCounts } = useContext(FilterContext)
  const {
    origins, countries, sectors, organizations, sdgs, tags, useCases, workflows, buildingBlocks,
    endorsers, productDeployable, withMaturity, search, licenseTypes
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
      withMaturity,
      search
    },
    context: { headers: { 'Accept-Language': locale } },
    onCompleted: (data) => {
      setResultCounts({
        ...resultCounts,
        ...{ [['filter.entity.products']]: data.searchProducts.totalCount }
      })
    }
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
        withMaturity,
        search
      }
    })
  }

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
    <div className='pt-4'>
      {
        displayType === 'list' &&
          <div className='flex flex-row my-3 px-4 gap-x-4'>
            <div className='w-4/12 text-sm font-semibold opacity-70'>
              {format('product.header').toUpperCase()}
            </div>
            <div className='hidden lg:block w-4/12 text-sm font-semibold opacity-50'>
              {format('origin.header').toUpperCase()}
            </div>
            <div className='hidden lg:block w-2/12 text-sm text-right px-2 font-semibold opacity-50'>
              {format('product.license').toUpperCase()}
            </div>
          </div>
      }
      <div className='block pr-2' style={{ height: 'calc(100vh + 600px)' }}>
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
                          const product = nodes[currentIndex]

                          return (
                            <div
                              style={{
                                ...style,
                                left: style.left + PRODUCT_CARD_GUTTER_SIZE,
                                top: style.top + PRODUCT_CARD_GUTTER_SIZE,
                                width: style.width - PRODUCT_CARD_GUTTER_SIZE,
                                height: style.height - PRODUCT_CARD_GUTTER_SIZE
                              }}
                            >
                              {
                                currentIndex < nodes.length && product &&
                                <ProductCard listType={displayType} {...{ product, filterDisplayed }} />
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
                          const product = nodes[index]

                          return (
                            <div style={style}>
                              {
                                index < nodes.length && product &&
                                <ProductCard listType={displayType} {...{ product, filterDisplayed }} />
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
    </div>
  )
}

export default ProductListQuery
