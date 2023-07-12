import { useCallback, useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import InfiniteScroll from 'react-infinite-scroll-component'
import { FilterContext } from '../context/FilterContext'
import { UseCaseFilterContext } from '../context/UseCaseFilterContext'
import NotFound from '../shared/NotFound'
import { Loading, Error } from '../shared/FetchStatus'
import { USE_CASES_QUERY } from '../../queries/use-case'
import UseCaseCard from './UseCaseCard'

const DEFAULT_PAGE_SIZE = 20

const UseCaseList = (props) => {
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
                {format('useCase.header').toUpperCase()}
              </div>
              <div className='hidden lg:block w-8/12 lg:w-2/12 opacity-50'>
                {format('sdg.sdgTargets').toUpperCase()}
              </div>
              <div className='hidden lg:block w-8/12 lg:w-4/12 opacity-50'>
                {format('exampleOf.entity', { entity: format('workflow.header') }).toUpperCase()}
              </div>
            </div>
        }
        {
          props.useCaseList.length > 0
            ? props.useCaseList.map((useCase) => (
              <UseCaseCard key={useCase.id} listType={displayType} {...{ useCase }} />
            ))
            : (
              <div className='col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 px-1'>
                {format('noResults.entity', { entity: format('useCase.label').toLowerCase() })}
              </div>
            )
        }
      </div>
    </>
  )
}

const UseCaseListQuery = () => {
  const { displayType, setResultCounts } = useContext(FilterContext)
  const { sdgs, showBeta, govStackOnly, search } = useContext(UseCaseFilterContext)

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data, fetchMore } = useQuery(USE_CASES_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      sdgs: sdgs.map(sdg => sdg.value),
      showBeta,
      govStackOnly,
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
        showBeta,
        govStackOnly,
        search
      }
    })
  }

  useEffect(() => {
    if (data) {
      setResultCounts(resultCounts => {
        return {
          ...resultCounts,
          ...{ [['filter.entity.useCases']]: data.searchUseCases.totalCount }
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

  const { searchUseCases: { nodes, pageInfo } } = data

  return (
    <>
      <InfiniteScroll
        className='relative infinite-scroll-default-height'
        dataLength={nodes.length}
        next={handleLoadMore}
        hasMore={pageInfo.hasNextPage}
        loader={<div className='relative text-center mt-3'>{format('general.loadingData')}</div>}
      >
        <UseCaseList useCaseList={nodes} displayType={displayType} />
      </InfiniteScroll>
    </>
  )
}

export default UseCaseListQuery
