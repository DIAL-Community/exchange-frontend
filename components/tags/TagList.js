import { useCallback, useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import InfiniteScroll from 'react-infinite-scroll-component'
import classNames from 'classnames'
import { FilterContext } from '../context/FilterContext'
import { UserFilterContext } from '../context/UserFilterContext'
import { Loading, Error } from '../shared/FetchStatus'
import NotFound from '../shared/NotFound'
import { TAGS_LIST_QUERY } from '../../queries/tag'
import { DEFAULT_PAGE_SIZE, DisplayType } from '../../lib/constants'
import TagCard from './TagCard'

const TagList = ({ tagList, displayType }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className={classNames('grid', { 'grid-cols-1' : displayType === DisplayType.LIST })}>
      {
        tagList.length
          ? tagList.map((tag) => (
            <TagCard key={tag.id} listType={displayType} tag={tag} displayEditButtons/>
          )) : (
            <div className='col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 px-6'>
              {format('noResults.entity', { entity: format('tag.label') })}
            </div>
          )
      }
    </div>
  )
}

const TagsListQuery = () => {
  const { setResultCounts } = useContext(FilterContext)
  const { search } = useContext(UserFilterContext)

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data, fetchMore } = useQuery(TAGS_LIST_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      search
    }
  })

  function handleLoadMore() {
    fetchMore({
      variables: {
        after: pageInfo.endCursor,
        first: DEFAULT_PAGE_SIZE
      }
    })
  }

  useEffect(() => {
    if (data) {
      setResultCounts(resultCounts => {
        return {
          ...resultCounts,
          ...{ [['filter.entity.tags']]: data.searchTags.totalCount }
        }
      })
    }
  }, [data, setResultCounts])

  if (loading) {
    return <Loading />
  } else if (error && error.networkError) {
    return <Error />
  } else if  (error && !error.networkError) {
    return <NotFound />
  }

  const { searchTags: { nodes, pageInfo } } = data

  return (
    <InfiniteScroll
      className='relative'
      dataLength={nodes.length}
      next={handleLoadMore}
      hasMore={pageInfo.hasNextPage}
      loader={<div className='relative text-center mt-3'>{format('general.loadingData')}</div>}
    >
      <TagList tagList={nodes} displayType={DisplayType.LIST}/>
    </InfiniteScroll>
  )
}

export default TagsListQuery
