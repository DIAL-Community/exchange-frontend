import { useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { gql, useQuery } from '@apollo/client'
import InfiniteScroll from 'react-infinite-scroll-component'
import { HiSortAscending } from 'react-icons/hi'
import { FilterContext } from '../context/FilterContext'
import { WorkflowFilterContext } from '../context/WorkflowFilterContext'
import { Loading, Error } from '../shared/FetchStatus'
import WorkflowCard from './WorkflowCard'

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
  const format = (id, values) => formatMessage({ id }, values)

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
            <div className='grid grid-cols-12 gap-4 my-3 px-4'>
              <div className='col-span-12 lg:col-span-4 ml-2 text-sm font-semibold text-workflow opacity-80'>
                {format('workflow.header').toUpperCase()}
                <HiSortAscending className='hidden ml-1 inline text-2xl' />
              </div>
              <div
                className={`
                  hidden ${filterDisplayed ? 'xl:block' : 'lg:block'}
                  col-span-4 text-sm font-semibold text-use-case opacity-80
                `}
              >
                {format('exampleOf.entity', { entity: format('useCase.header') }).toUpperCase()}
                <HiSortAscending className='hidden ml-1 inline text-2xl' />
              </div>
              <div
                className={`
                  hidden ${filterDisplayed ? 'xl:block' : 'lg:block'}
                  col-span-4 text-sm font-semibold text-building-block
                `}
              >
                {format('exampleOf.entity', { entity: format('building-block.header') }).toUpperCase()}
                <HiSortAscending className='hidden ml-1 inline text-2xl' />
              </div>
            </div>
        }
        {
          props.workflowList.length > 0
            ? props.workflowList.map((workflow) => (
              <WorkflowCard key={workflow.id} listType={displayType} {...{ workflow, filterDisplayed }} />
            ))
            : (
              <div className='col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 px-1'>
                {format('noResults.entity', { entity: format('workflow.label').toLowerCase() })}
              </div>
            )
        }
      </div>
    </>
  )
}

const WorkflowListQuery = () => {
  const { resultCounts, filterDisplayed, displayType, setResultCounts } = useContext(FilterContext)
  const { sdgs, useCases, search } = useContext(WorkflowFilterContext)

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  const { loading, error, data, fetchMore } = useQuery(WORKFLOWS_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      sdgs: sdgs.map(sdg => sdg.value),
      useCases: useCases.map(useCase => useCase.value),
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
        search
      }
    })
  }

  useEffect(() => {
    if (data) {
      setResultCounts({
        ...resultCounts,
        ...{ [['filter.entity.workflows']]: data.searchWorkflows.totalCount }
      })
    }
  }, [data])

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error />
  }

  const { searchWorkflows: { nodes, pageInfo } } = data

  return (
    <InfiniteScroll
      className='relative px-2 mt-3 pb-8 max-w-catalog mx-auto infinite-scroll-default-height'
      dataLength={nodes.length}
      next={handleLoadMore}
      hasMore={pageInfo.hasNextPage}
      loader={<div className='relative text-center mt-3'>{format('general.loadingData')}</div>}
    >
      <WorkflowList workflowList={nodes} displayType={displayType} filterDisplayed={filterDisplayed} />
    </InfiniteScroll>
  )
}

export default WorkflowListQuery
