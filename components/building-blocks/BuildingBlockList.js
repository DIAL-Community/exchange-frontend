import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import InfiniteScroll from 'react-infinite-scroll-component'

import BuildingBlockCard from './BuildingBlockCard'
import { BuildingBlockFilterContext } from '../context/BuildingBlockFilterContext'
import { FilterResultContext, convertToKey } from '../context/FilterResultContext'
import { HiSortAscending } from 'react-icons/hi'

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
  const displayType = props.displayType
  const gridStyles = `grid ${displayType === 'card' ? 'grid-cols-4 gap-4' : 'grid-cols-1'}`

  return (
    <>
      <div className={gridStyles}>
        {
          displayType === 'list' &&
            <div className='grid grid-cols-12 my-3 px-4 text-building-block'>
              <div className='col-span-4 ml-2 text-sm font-semibold opacity-80'>
                {'Building Blocks'.toUpperCase()}
                <HiSortAscending className='ml-1 inline text-2xl' />
              </div>
              <div className='col-span-3 text-sm font-semibold opacity-50'>
                {'Example Products'.toUpperCase()}
                <HiSortAscending className='ml-1 inline text-2xl' />
              </div>
              <div className='col-span-4 text-sm font-semibold opacity-50'>
                {'Example Workflows'.toUpperCase()}
                <HiSortAscending className='ml-1 inline text-2xl' />
              </div>
              <div className='col-span-1' />
            </div>
        }
        {
          props.buildingBlockList.map((buildingBlock) => (
            <BuildingBlockCard key={buildingBlock.id} buildingBlock={buildingBlock} listType={displayType} />
          ))
        }
      </div>
    </>
  )
}

const BuildingBlockListQuery = () => {
  const { resultCounts, setResultCounts } = useContext(FilterResultContext)
  const { sdgs, useCases, workflows, showMature, search, displayType } = useContext(BuildingBlockFilterContext)

  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const { loading, error, data, fetchMore } = useQuery(BUILDING_BLOCKS_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      sdgs: sdgs.map(sdg => sdg.value),
      useCases: useCases.map(useCase => useCase.value),
      workflows: workflows.map(workflow => workflow.value),
      showMature: showMature,
      search: search
    },
    onCompleted: (data) => {
      setResultCounts({ ...resultCounts, ...{ [`${convertToKey('Building Blocks')}`]: data.searchBuildingBlocks.totalCount }})
    }
  })

  if (loading) {
    return <div className='relative text-center my-3'>{format('general.fetchingData')}</div>
  }

  if (error) {
    return <div className='relative text-center my-3'>{format('general.fetchError')}</div>
  }

  const { searchBuildingBlocks: { nodes, pageInfo } } = data

  function handleLoadMore () {
    fetchMore({
      variables: {
        after: pageInfo.endCursor,
        first: DEFAULT_PAGE_SIZE,
        sdgs: sdgs.map(sdg => sdg.value),
        useCases: useCases.map(useCase => useCase.value),
        workflows: workflows.map(workflow => workflow.value),
        showMature: showMature,
        search: search
      }
    })
  }
  return (
    <>
      <InfiniteScroll
        className='relative mx-2 mt-3'
        dataLength={nodes.length}
        next={handleLoadMore}
        hasMore={pageInfo.hasNextPage}
        loader={<div className='relative text-center mt-3'>{format('general.loadingData')}</div>}
      >
        <BuildingBlockList buildingBlockList={nodes} displayType={displayType} />
      </InfiniteScroll>
    </>
  )
}

export default BuildingBlockListQuery
