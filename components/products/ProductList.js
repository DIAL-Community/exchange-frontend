import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
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
        imageFile
      }
      productDescriptions {
        description
        locale
      }
      organizations {
        name
        isEndorser
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

  const displayType = props.displayType
  const gridStyles = `grid ${displayType === 'card' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4' : 'grid-cols-1'}`

  return (
    <>
      <div className={gridStyles}>
        {
          displayType === 'list' &&
            <div className='grid grid-cols-12 my-3 px-4'>
              <div className='col-span-5 ml-2 text-sm font-semibold opacity-70'>
                {format('product.header').toUpperCase()}
                <HiSortAscending className='hidden ml-1 inline text-2xl' />
              </div>
              <div className='hidden md:block col-span-2 text-sm font-semibold opacity-50'>
                {format('product.card.dataset').toUpperCase()}?
                <HiSortAscending className='hidden ml-1 inline text-2xl' />
              </div>
              <div className='hidden md:block col-span-4 text-sm font-semibold opacity-50'>
                {format('origin.header').toUpperCase()}
                <HiSortAscending className='hidden ml-1 inline text-2xl' />
              </div>
            </div>
        }
        {
          props.productList.length > 0
            ? props.productList.map((product) => (
              <ProductCard key={product.id} product={product} listType={displayType} />
              ))
            : (
              <div className='flex justify-self-center text-dial-gray-dark'>{
                format('noResults.entity', { entity: format('products.label') })
                }
              </div>
              )
        }
      </div>
    </>
  )
}

const ProductListQuery = () => {
  const { resultCounts, displayType, setResultCounts } = useContext(FilterContext)
  const {
    origins, countries, sectors, organizations, sdgs, tags, useCases, workflows, buildingBlocks, productTypes,
    endorsers, productDeployable, withMaturity, search
  } = useContext(ProductFilterContext)

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

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
      productTypes: productTypes.map(productType => productType.value),
      endorsers: endorsers.map(endorser => endorser.value),
      productDeployable: productDeployable,
      withMaturity: withMaturity,
      search: search
    },
    onCompleted: (data) => {
      setResultCounts({ ...resultCounts, ...{ [['filter.entity.products']]: data.searchProducts.totalCount } })
    }
  })

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error />
  }

  const { searchProducts: { nodes, pageInfo } } = data

  function handleLoadMore () {
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
  return (
    <InfiniteScroll
      className='relative px-2 mt-3 pb-8 max-w-catalog mx-auto'
      dataLength={nodes.length}
      next={handleLoadMore}
      hasMore={pageInfo.hasNextPage}
      loader={<div className='relative text-center mt-3'>{format('general.loadingData')}</div>}
    >
      <ProductList productList={nodes} displayType={displayType} />
    </InfiniteScroll>
  )
}

export default ProductListQuery
