import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import InfiniteScroll from 'react-infinite-scroll-component'

import WorkflowCard from './WorkflowCard'
import { WorkflowFilterContext } from '../context/WorkflowFilterContext'
import { FilterResultContext, convertToKey } from '../context/FilterResultContext'
import { HiSortAscending } from 'react-icons/hi'

const DEFAULT_PAGE_SIZE = 20

const WORKFLOWS_QUERY = gql`
query SearchWorkflows(
  $first: Int,
  $after: String,
  $sdgs: [String!],
  $useCases: [String!],
  $search: String!
  ) {
  searchWorkflows(
    first: $first,
    after: $after,
    sdgs: $sdgs,
    useCases: $useCases,
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
      useCaseSteps {
        slug
        name
        useCase {
          slug
          name
          imageFile
        }
      }
      buildingBlocks {
        slug
        name
        imageFile
      }
    }
  }
}
`

const WorkflowList = (props) => {
  const displayType = props.displayType
  const gridStyles = `grid ${displayType === 'card' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4' : 'grid-cols-1'}`

  return (
    <>
      <div className={gridStyles}>
        {
          displayType === 'list' &&
            <div className='grid grid-cols-12 my-3 px-4'>
              <div className='col-span-4 ml-2 text-sm font-semibold text-workflow opacity-80'>
                {'Workflows'.toUpperCase()}
                <HiSortAscending className='ml-1 inline text-2xl' />
              </div>
              <div className='col-span-4 text-sm font-semibold text-use-case opacity-80'>
                {'Example Use Cases'.toUpperCase()}
                <HiSortAscending className='ml-1 inline text-2xl' />
              </div>
              <div className='col-span-4 text-sm font-semibold text-building-block'>
                {'Example Building Blocks'.toUpperCase()}
                <HiSortAscending className='ml-1 inline text-2xl' />
              </div>
            </div>
        }
        {
          props.workflowList.map((workflow) => (
            <WorkflowCard key={workflow.id} workflow={workflow} listType={displayType} />
          ))
        }
      </div>
    </>
  )
}

const WorkflowListQuery = () => {
  const { resultCounts, setResultCounts } = useContext(FilterResultContext)
  const { sdgs, useCases, search, displayType } = useContext(WorkflowFilterContext)

  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const { loading, error, data, fetchMore } = useQuery(WORKFLOWS_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      sdgs: sdgs.map(sdg => sdg.value),
      useCases: useCases.map(useCase => useCase.value),
      search: search
    },
    onCompleted: (data) => {
      setResultCounts({ ...resultCounts, ...{ [`${convertToKey('Workflows')}`]: data.searchWorkflows.totalCount } })
    }
  })

  if (loading) {
    return <div className='relative text-center my-3'>{format('general.fetchingData')}</div>
  }

  if (error) {
    return <div className='relative text-center my-3 default-height'>{format('general.fetchError')}</div>
  }

  const { searchWorkflows: { nodes, pageInfo } } = data

  function handleLoadMore () {
    fetchMore({
      variables: {
        after: pageInfo.endCursor,
        first: DEFAULT_PAGE_SIZE,
        sdgs: sdgs.map(sdg => sdg.value),
        useCases: useCases.map(useCase => useCase.value),
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
      <WorkflowList workflowList={nodes} displayType={displayType} />
    </InfiniteScroll>
  )
}

export default WorkflowListQuery
