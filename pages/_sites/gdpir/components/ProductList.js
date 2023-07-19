import { useCallback, useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { FixedSizeGrid, FixedSizeList } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import InfiniteLoader from 'react-window-infinite-loader'
import { FilterContext } from '../../../../components/context/FilterContext'
import { ProductFilterContext } from '../../../../components/context/ProductFilterContext'
import { Loading, Error } from '../../../../components/shared/FetchStatus'
import NotFound from '../../../../components/shared/NotFound'
import { PRODUCTS_QUERY } from '../../../../queries/product'
import ProductCard from '../../../../components/products/ProductCard'

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
const MIN_PRODUCT_LIST_SIZE = 68

const gridStyles = 'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'

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
      <div className='text-dial-gray-dark my-5 mx-10 text-xl'>Digital Public Infrastructure</div>
      <div className={gridStyles}>
        { isProductLoaded &&
              nodes.map((product, idx) => (
                product.isLinkedWithDpi &&
                  <ProductCard key={idx} listType={'card'} {...{ product }} />
              ))
        }
      </div>
      <div className='text-dial-gray-dark my-5 mx-10 text-xl'>Other Digital Public Goods</div>
      <div className={gridStyles}>
        { isProductLoaded &&
              nodes.map((product, idx) => (
                !product.isLinkedWithDpi &&
                  <ProductCard key={idx} listType={'card'} {...{ product }} />
              ))
        }
      </div>
    </>
  )
}

export default ProductListQuery
