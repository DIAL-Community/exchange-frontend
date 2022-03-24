import { useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { gql, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'

import InfiniteScroll from 'react-infinite-scroll-component'

import ProductCard from './ProductCard'
import { ProductFilterContext } from '../context/ProductFilterContext'
import { FilterContext } from '../context/FilterContext'
import { HiSortAscending } from 'react-icons/hi'
import { Loading, Error } from '../shared/FetchStatus'

const DEFAULT_PAGE_SIZE = 20

const PRODUCTS_QUERY = gql`
query SearchProducts(
  $first: Int,
  $after: String,
  $origins: [String!],
  $sectors: [String!],
  $countries: [String!],
  $organizations: [String!],
  $sdgs: [String!],
  $tags: [String!],
  $useCases: [String!],
  $workflows: [String!],
  $buildingBlocks: [String!],
  $productTypes: [String!],
  $endorsers: [String!],
  $productDeployable: Boolean,
  $withMaturity: Boolean,
  $search: String!
  ) {
  searchProducts(
    first: $first,
    after: $after,
    origins: $origins,
    sectors: $sectors,
    countries: $countries,
    organizations: $organizations,
    sdgs: $sdgs,
    tags: $tags,
    useCases: $useCases,
    workflows: $workflows,
    buildingBlocks: $buildingBlocks,
    productTypes: $productTypes,
    endorsers: $endorsers,
    productDeployable: $productDeployable,
    withMaturity: $withMaturity,
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
      isLaunchable
      maturityScore
      productType
      tags
      endorsers {
        name
        slug
      }
      origins{
        name
        slug
      }
      buildingBlocks {
        slug
        name
        imageFile
      }
      sustainableDevelopmentGoals {
        slug
        name
      }
      productDescription {
        description
        locale
      }
      mainRepository {
        license
      }
    }
  }
}
`

const ProductList = (props) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const filterDisplayed = props.filterDisplayed
  const displayType = props.displayType
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
            <div className='grid grid-cols-12 my-3 px-4 gap-x-4'>
              <div className='col-span-4 ml-2 text-sm font-semibold opacity-70'>
                {format('product.header').toUpperCase()}
                <HiSortAscending className='hidden ml-1 inline text-2xl' />
              </div>
              <div
                className={`
                  hidden ${filterDisplayed ? 'xl:block' : 'lg:block'}
                  col-span-2 text-sm font-semibold opacity-50
                `}
              >
                {format('product.card.dataset').toUpperCase()}
                <HiSortAscending className='hidden ml-1 inline text-2xl' />
              </div>
              <div
                className={`
                  hidden ${filterDisplayed ? 'xl:block' : 'lg:block'}
                  col-span-4 text-sm font-semibold opacity-50
                `}
              >
                {format('origin.header').toUpperCase()}
                <HiSortAscending className='hidden ml-1 inline text-2xl' />
              </div>
            </div>
        }
        {
          props.productList.length > 0
            ? props.productList.map((product) => (
              <ProductCard key={product.id} listType={displayType} {...{ product, filterDisplayed }} />
              ))
            : (
              <div className='col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 px-1'>
                {format('noResults.entity', { entity: format('products.label').toLowerCase() })}
              </div>
              )
        }
      </div>
    </>
  )
}

const ProductListQuery = () => {
  const { resultCounts, filterDisplayed, displayType, setResultCounts } = useContext(FilterContext)
  const {
    origins, countries, sectors, organizations, sdgs, tags, useCases, workflows, buildingBlocks, productTypes,
    endorsers, productDeployable, withMaturity, search
  } = useContext(ProductFilterContext)

  const { locale } = useRouter()
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const { loading, error, data, fetchMore, refetch } = useQuery(PRODUCTS_QUERY, {
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
      productTypes: productTypes.map(productType => productType.value),
      endorsers: endorsers.map(endorser => endorser.value),
      productDeployable: productDeployable,
      withMaturity: withMaturity,
      search: search
    },
    context: { headers: { 'Accept-Language': locale } }
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
        productTypes: productTypes.map(productType => productType.value),
        endorsers: endorsers.map(endorser => endorser.value),
        productDeployable: productDeployable,
        withMaturity: withMaturity,
        search: search
      }
    })
  }

  useEffect(() => {
    refetch()
  }, [locale])

  useEffect(() => {
    if (data) {
      setResultCounts({
        ...resultCounts,
        ...{ [['filter.entity.products']]: data.searchProducts.totalCount }
      })
    }
  }, [data])

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error />
  }

  const { searchProducts: { nodes, pageInfo } } = data
  return (
    <InfiniteScroll
      className='relative px-2 mt-3 pb-8 max-w-catalog mx-auto infinite-scroll-default-height'
      dataLength={nodes.length}
      next={handleLoadMore}
      hasMore={pageInfo.hasNextPage}
      loader={<div className='relative text-center mt-3'>{format('general.loadingData')}</div>}
    >
      <ProductList productList={nodes} displayType={displayType} filterDisplayed={filterDisplayed} />
    </InfiniteScroll>
  )
}

export default ProductListQuery
