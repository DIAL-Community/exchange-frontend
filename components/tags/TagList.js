import { useContext } from 'react'
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
  const format = (id, values) => formatMessage({ id }, values)

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
  const { resultCounts, setResultCounts } = useContext(FilterContext)
  const { search } = useContext(UserFilterContext)

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  const { loading, error, data, fetchMore } = useQuery(TAGS_LIST_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      search
    },
    onCompleted: (data) => {
      setResultCounts({ ...resultCounts, ...{ [['filter.entity.tags']]: data.searchTags.totalCount } })
    }
  })

  if (loading) {
    return <Loading />
  } else if (error && error.networkError) {
    return <Error />
  } else if  (error && !error.networkError) {
    return <NotFound />
  }

  const { searchTags: { nodes, pageInfo } } = data

  function handleLoadMore() {
    fetchMore({
      variables: {
        after: pageInfo.endCursor,
        first: DEFAULT_PAGE_SIZE
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
      <TagList tagList={nodes} displayType={DisplayType.LIST}/>
    </InfiniteScroll>
  )
}

export default TagsListQuery