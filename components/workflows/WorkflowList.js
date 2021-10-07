import { useContext } from 'react'
import { useIntl, FormattedMessage } from 'react-intl'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import InfiniteScroll from 'react-infinite-scroll-component'

import WorkflowCard from './WorkflowCard'
import { WorkflowFilterContext } from '../context/WorkflowFilterContext'
import { FilterContext } from '../context/FilterContext'
import { HiSortAscending } from 'react-icons/hi'
import { Loading, Error } from '../shared/FetchStatus'

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
        id
        slug
        name
        useCase {
          id
          slug
          name
          imageFile
        }
      }
      buildingBlocks {
        id
        slug
        name
        imageFile
      }
    }
  }
}
`

const WorkflowList = (props) => {
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
              <div className='col-span-12 lg:col-span-4 ml-2 text-sm font-semibold text-workflow opacity-80'>
                {format('workflow.header').toUpperCase()}
                <HiSortAscending className='hidden ml-1 inline text-2xl' />
              </div>
              <div className='hidden lg:block col-span-4 text-sm font-semibold text-use-case opacity-80'>
                {format('exampleOf.entity', { entity: format('useCase.header') }).toUpperCase()}
                <HiSortAscending className='hidden ml-1 inline text-2xl' />
              </div>
              <div className='hidden lg:block col-span-4 text-sm font-semibold text-building-block'>
                {format('exampleOf.entity', { entity: format('building-block.header') }).toUpperCase()}
                <HiSortAscending className='hidden ml-1 inline text-2xl' />
              </div>
            </div>
        }
        {
          props.workflowList.length > 0
            ? props.workflowList.map((workflow) => (
              <WorkflowCard key={workflow.id} workflow={workflow} listType={displayType} />
              ))
            : (
              <div className='flex justify-self-center text-dial-gray-dark'>{
                format('noResults.entity', { entity: format('workflow.header') })
                }
              </div>
              )
        }
      </div>
    </>
  )
}

const WorkflowListQuery = () => {
  const { resultCounts, displayType, setResultCounts } = useContext(FilterContext)
  const { sdgs, useCases, search } = useContext(WorkflowFilterContext)

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
      setResultCounts({ ...resultCounts, ...{ [['filter.entity.workflows']]: data.searchWorkflows.totalCount } })
    }
  })

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error />
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
      className='relative px-2 mt-3 pb-8 max-w-catalog mx-auto'
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
