import { useCallback, useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import InfiniteScroll from 'react-infinite-scroll-component'
import { FilterContext } from '../context/FilterContext'
import { UserFilterContext } from '../context/UserFilterContext'
import { Loading, Error } from '../shared/FetchStatus'
import NotFound from '../shared/NotFound'
import { RESOURCES_LIST_QUERY } from '../../queries/resource'
import { DEFAULT_PAGE_SIZE } from '../../lib/constants'
import ResourceCard from './ResourceCard'

const ResourceList = ({ resourceList, displayType }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const gridStyles = `grid ${displayType === 'card'
    ? 'grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5'
    : 'grid-cols-1'
    }`

  return (
    <>
      <div className={gridStyles}>
        {
          displayType === 'list' &&
            <div className='flex gap-x-2 lg:gap-x-4 px-4 my-3 px-4 text-sm font-semibold'>
              <div className='w-10/12 lg:w-4/12 opacity-80'>
                {format('resource.header').toUpperCase()}
              </div>
            </div>
        }
        {
          resourceList.length > 0
            ? resourceList.map((resource) => (
              <ResourceCard key={resource.id} listType={displayType} {...{ resource }} />
            ))
            : (
              <div className='col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 px-1'>
                {format('noResults.entity', { entity: format('resource.label').toLowerCase() })}
              </div>
            )
        }
      </div>
    </>
  )
}

const ResourcesListQuery = () => {
  const { displayType, setResultCounts } = useContext(FilterContext)
  const { search } = useContext(UserFilterContext)

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data, fetchMore } = useQuery(RESOURCES_LIST_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      search
    }
  })

  function handleLoadMore() {
    fetchMore({
      variables: {
        after: pageInfo.endCursor,
        first: DEFAULT_PAGE_SIZE,
        search
      }
    })
  }

  useEffect(() => {
    if (data) {
      setResultCounts(resultCounts => {
        return {
          ...resultCounts,
          ...{ [['filter.entity.resources']]: data.searchResources.totalCount }
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

  const { searchResources: { nodes, pageInfo } } = data

  return (
    <div className='flex flex-col gap-3'>
      <div className='text-base'>
        {format('resource.subHeader')}
      </div>
      <InfiniteScroll
        className='relative'
        dataLength={nodes.length}
        next={handleLoadMore}
        hasMore={pageInfo.hasNextPage}
        loader={<div className='relative text-center mt-3'>{format('general.loadingData')}</div>}
      >
        <ResourceList resourceList={nodes} displayType={displayType} />
      </InfiniteScroll>
    </div>
  )
}

export default ResourcesListQuery
