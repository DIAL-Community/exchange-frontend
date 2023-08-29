import { useCallback, useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import InfiniteScroll from 'react-infinite-scroll-component'
import { HiSortAscending } from 'react-icons/hi'
import { FilterContext } from '../context/FilterContext'
import { WorkflowFilterContext } from '../context/WorkflowFilterContext'
import NotFound from '../shared/NotFound'
import { Loading, Error } from '../shared/FetchStatus'
import { WORKFLOWS_QUERY } from '../../queries/workflow'
import WorkflowCard from './WorkflowCard'

const DEFAULT_PAGE_SIZE = 20

const WorkflowList = (props) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const displayType = props.displayType
  const gridStyles = `grid ${displayType === 'card'
    ? 'grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'
    : 'grid-cols-1'
    }`

  return (
    <>
      <div className={gridStyles}>
        {
          displayType === 'list' &&
            <div className='flex gap-x-2 lg:gap-x-4 px-4 my-3 px-4 text-sm font-semibold'>
              <div className='w-10/12 lg:w-4/12 opacity-80'>
                {format('workflow.header').toUpperCase()}
                <HiSortAscending className='hidden ml-1 inline text-2xl' />
              </div>
              <div className='w-8/12 lg:w-4/12 line-clamp-1'>
                {format('exampleOf.entity', { entity: format('useCase.header') }).toUpperCase()}
              </div>
              <div className='w-8/12 lg:w-3/12 line-clamp-1'>
                {format('exampleOf.entity', { entity: format('ui.buildingBlock.header') }).toUpperCase()}
              </div>
            </div>
        }
        {
          props.workflowList.length > 0
            ? props.workflowList.map((workflow) => (
              <WorkflowCard key={workflow.id} listType={displayType} {...{ workflow }} />
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
  const { displayType, setResultCounts } = useContext(FilterContext)
  const { sdgs, useCases, search } = useContext(WorkflowFilterContext)

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data, fetchMore } = useQuery(WORKFLOWS_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      sdgs: sdgs.map(sdg => sdg.value),
      useCases: useCases.map(useCase => useCase.value),
      search
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first'
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
      setResultCounts(resultCounts => {
        return {
          ...resultCounts,
          ...{ [['filter.entity.workflows']]: data.searchWorkflows.totalCount }
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

  const { searchWorkflows: { nodes, pageInfo } } = data

  return (
    <InfiniteScroll
      className='relative infinite-scroll-default-height'
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
