import { useContext, useEffect } from 'react'
import { useIntl, FormattedMessage } from 'react-intl'
import { gql, useQuery } from '@apollo/client'
import InfiniteScroll from 'react-infinite-scroll-component'
import { HiSortAscending } from 'react-icons/hi'
import { BuildingBlockFilterContext } from '../context/BuildingBlockFilterContext'
import { FilterContext } from '../context/FilterContext'
import { Loading, Error } from '../shared/FetchStatus'
import BuildingBlockCard from './BuildingBlockCard'

const DEFAULT_PAGE_SIZE = 20

const BUILDING_BLOCKS_QUERY = gql`
query SearchBuildingBlocks(
  $first: Int,
  $after: String,
  $sdgs: [String!],
  $useCases: [String!],
  $workflows: [String!],
  $showMature: Boolean,
  $search: String!
  ) {
  searchBuildingBlocks(
    first: $first,
    after: $after,
    sdgs: $sdgs,
    useCases: $useCases,
    workflows: $workflows,
    showMature: $showMature,
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
      maturity
      specUrl
      workflows {
        slug
        name
        imageFile
      }
      products {
        slug
        name
        imageFile
      }
    }
  }
}
`

const BuildingBlockList = (props) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const filterDisplayed = props.filterDisplayed
  const displayType = props.displayType
  const gridStyles = `grid ${displayType === 'card'
    ? `grid-cols-1 gap-4
       ${filterDisplayed ? 'md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'}`
    : 'grid-cols-1'
    }`

  return (
    <>
      <div className={gridStyles}>
        {
          displayType === 'list' &&
            <div className='grid grid-cols-12 my-3 px-4 text-building-block'>
              <div className='col-span-10 lg:col-span-4 text-sm font-semibold opacity-80'>
                {format('building-block.header').toUpperCase()}
                <HiSortAscending className='hidden ml-1 inline text-2xl' />
              </div>
              <div
                className={`
                  hidden ${filterDisplayed ? 'xl:block' : 'lg:block'}
                  col-span-3 text-sm text-product font-semibold opacity-50
                `}
              >
                {format('exampleOf.entity', { entity: format('product.header') }).toUpperCase()}
                <HiSortAscending className='hidden ml-1 inline text-2xl' />
              </div>
              <div
                className={`
                  hidden ${filterDisplayed ? 'xl:block' : 'lg:block'}
                  col-span-3 text-sm font-semibold text-workflow opacity-50
                `}
              >
                {format('exampleOf.entity', { entity: format('workflow.header') }).toUpperCase()}
                <HiSortAscending className='hidden ml-1 inline text-2xl' />
              </div>
            </div>
        }
        {
          props.buildingBlockList.length > 0
            ? props.buildingBlockList.map((buildingBlock) => (
              <BuildingBlockCard key={buildingBlock.id} listType={displayType} {...{ buildingBlock, filterDisplayed }} />
            ))
            : (
              <div className='col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 px-1'>
                {format('noResults.entity', { entity: format('building-block.label').toLowerCase() })}
              </div>
            )
        }
      </div>
    </>
  )
}

const BuildingBlockListQuery = () => {
  const { resultCounts, filterDisplayed, displayType, setResultCounts } = useContext(FilterContext)
  const { sdgs, useCases, workflows, showMature, search } = useContext(BuildingBlockFilterContext)

  const format = (id, value = {}) => <FormattedMessage id={id} values={{ ...value }} />

  const { loading, error, data, fetchMore } = useQuery(BUILDING_BLOCKS_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      sdgs: sdgs.map(sdg => sdg.value),
      useCases: useCases.map(useCase => useCase.value),
      workflows: workflows.map(workflow => workflow.value),
      showMature,
      search
    }
  })

  const handleLoadMore = () => {
    fetchMore({
      variables: {
        after: pageInfo.endCursor,
        first: DEFAULT_PAGE_SIZE,
        sdgs: sdgs.map(sdg => sdg.value),
        useCases: useCases.map(useCase => useCase.value),
        workflows: workflows.map(workflow => workflow.value),
        showMature,
        search
      }
    })
  }

  useEffect(() => {
    if (data) {
      setResultCounts({
        ...resultCounts,
        ...{ [['filter.entity.buildingBlocks']]: data.searchBuildingBlocks.totalCount }
      })
    }
  }, [data])

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error />
  }

  const { searchBuildingBlocks: { nodes, pageInfo } } = data
  
  return (
    <>
      <InfiniteScroll
        className='relative px-2 mt-3 pb-8 max-w-catalog mx-auto infinite-scroll-default-height'
        dataLength={nodes.length}
        next={handleLoadMore}
        hasMore={pageInfo.hasNextPage}
        loader={<div className='relative text-center mt-3'>{format('general.loadingData')}</div>}
      >
        <BuildingBlockList buildingBlockList={nodes} displayType={displayType} filterDisplayed={filterDisplayed} />
      </InfiniteScroll>
    </>
  )
}

export default BuildingBlockListQuery
