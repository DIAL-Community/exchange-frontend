import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import InfiniteScroll from 'react-infinite-scroll-component'

import ProductCard from './ProductCard'
import { ProductFilterContext } from '../context/ProductFilterContext'
import { FilterResultContext, convertToKey } from '../context/FilterResultContext'
import { HiSortAscending } from 'react-icons/hi'

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
  $useCases: [String!],
  $workflows: [String!],
  $buildingBlocks: [String!],
  $productTypes: [String!],
  $productDeployable: Boolean,
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
    useCases: $useCases,
    workflows: $workflows,
    buildingBlocks: $buildingBlocks,
    productTypes: $productTypes,
    productDeployable: $productDeployable,
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
      license
      isLaunchable
      maturityScore
      productType
      tags
      origins{
        name
        slug
      }
      productDescriptions {
        description
      }
      buildingBlocks {
        slug
        imageFile
      }
      sustainableDevelopmentGoals {
        slug
        imageFile
      }
    }
  }
}
`

const ProductList = (props) => {
  const displayType = props.displayType
  const gridStyles = `grid ${displayType === 'card' ? 'grid-cols-4 gap-4' : 'grid-cols-1'}`

  return (
    <>
      <div className={gridStyles}>
        {
          displayType === 'list' &&
            <div className='grid grid-cols-12 my-3'>
              <div className='col-span-5 ml-6 text-sm font-semibold opacity-70'>
                {'Name'.toUpperCase()}
                <HiSortAscending className='ml-1 inline text-2xl' />
              </div>
              <div className='col-span-2 text-sm font-semibold opacity-50'>
                {'Product or Dataset'.toUpperCase()}
                <HiSortAscending className='ml-1 inline text-2xl' />
              </div>
              <div className='col-span-4 text-sm font-semibold opacity-50'>
                {'Sources'.toUpperCase()}
                <HiSortAscending className='ml-1 inline text-2xl' />
              </div>
              <div className='col-span-1' />
            </div>
        }
        {
          props.productList.map((product) => (
            <ProductCard key={product.id} product={product} listType={displayType} />
          ))
        }
      </div>
    </>
  )
}

const ProductListQuery = () => {
  const { resultCounts, setResultCounts } = useContext(FilterResultContext)
  const {
    origins, countries, sectors, organizations, sdgs, useCases, workflows, buildingBlocks, productTypes,
    productDeployable, search, displayType
  } = useContext(ProductFilterContext)

  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const { loading, error, data, fetchMore } = useQuery(PRODUCTS_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      origins: origins.map(origin => origin.value),
      countries: countries.map(country => country.value),
      sectors: sectors.map(sector => sector.value),
      organizations: organizations.map(organization => organization.value),
      sdgs: sdgs.map(sdg => sdg.value),
      useCases: useCases.map(useCase => useCase.value),
      workflows: workflows.map(workflow => workflow.value),
      buildingBlocks: buildingBlocks.map(buildingBlock => buildingBlock.value),
      productTypes: productTypes.map(productType => productType.value),
      productDeployable: productDeployable,
      search: search
    },
    onCompleted: (data) => {
      setResultCounts({ ...resultCounts, ...{ [`${convertToKey('Products')}`]: data.searchProducts.totalCount } })
    }
  })

  if (loading) {
    return <div className='relative text-center my-3'>{format('general.fetchingData')}</div>
  }

  if (error) {
    return <div className='relative text-center my-3'>{format('general.fetchError')}</div>
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
        useCases: useCases.map(useCase => useCase.value),
        workflows: workflows.map(workflow => workflow.value),
        buildingBlocks: buildingBlocks.map(buildingBlock => buildingBlock.value),
        productTypes: productTypes.map(productType => productType.value),
        productDeployable: productDeployable,
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
      <ProductList productList={nodes} displayType={displayType} />
    </InfiniteScroll>
  )
}

export default ProductListQuery
