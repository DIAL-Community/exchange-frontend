import { useCallback, useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import InfiniteScroll from 'react-infinite-scroll-component'
import NotFound from '../shared/NotFound'
import { Loading, Error } from '../shared/FetchStatus'
import { FilterContext } from '../context/FilterContext'
import { PlayFilterContext } from '../context/PlayFilterContext'
import { PLAYS_QUERY } from '../../queries/play'
import { PlayListContext } from './PlayListContext'
import PlayCard from './PlayCard'

export const SOURCE_TYPE_ASSIGNING = 'source.type.assign'
export const SOURCE_TYPE_LISTING = 'source.type.listing'

const DEFAULT_PAGE_SIZE = 20
const PlayList = ({ playbook, playList, currentPlays, displayType, filterDisplayed, sourceType }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const gridStyles = `grid ${displayType === 'card'
    ? `grid-cols-1 gap-4
       ${filterDisplayed ? 'md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'}`
    : 'grid-cols-1'
    }`

  return (
    <div className={gridStyles} >
      {
        displayType === 'list' && sourceType !== SOURCE_TYPE_ASSIGNING &&
          <div className='flex flex-row gap-4 px-3 py-4 h-16 w-full opacity-70'>
            <div className='w-3/6 text-sm font-semibold'>
              {format('ui.play.header').toUpperCase()}
            </div>
            <div className='hidden md:block w-full text-sm font-semibold my-1'>
              {format('ui.play.description').toUpperCase()}
            </div>
          </div>
      }
      {
        playList.length > 0
          ? playList.map((play, index) => {
            return (!currentPlays || !currentPlays.filter(e => e.id === play.id).length > 0) && (
              <PlayCard key={index} {...{ playbook, play, filterDisplayed, sourceType }} />
            )
          })
          : (
            <div className='text-sm font-medium opacity-80'>
              {format('noResults.entity', { entity: format('ui.play.label').toString().toLowerCase() })}
            </div>
          )
      }
    </div>
  )
}

const PlayListQuery = ({ playbook }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const { locale } = useRouter()

  const { currentPlays } = useContext(PlayListContext)
  const { setResultCounts } = useContext(FilterContext)

  const { search, tags } = useContext(PlayFilterContext)
  const { loading, error, data, fetchMore } = useQuery(PLAYS_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      tags,
      search
    },
    context: { headers: { 'Accept-Language': locale } }
  })

  const handleLoadMore = () => {
    fetchMore({
      variables: {
        first: DEFAULT_PAGE_SIZE,
        after: pageInfo.endCursor,
        search
      }
    })
  }

  useEffect(() => {
    if (data) {
      setResultCounts(resultCounts => {
        return {
          ...resultCounts,
          ...{ [['filter.entity.plays']]: data.searchPlays.totalCount }
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

  const viewType = 'list'
  const { searchPlays: { nodes, pageInfo } } = data

  return (
    <>
      <InfiniteScroll
        className='bg-white relative'
        height='50vh'
        dataLength={nodes.length}
        next={handleLoadMore}
        hasMore={pageInfo.hasNextPage}
        loader={<div className='text-center mt-3'>{format('general.loadingData')}</div>}
      >
        <PlayList playList={nodes} displayType={viewType} {...{ playbook, currentPlays }} />
      </InfiniteScroll>
    </>
  )
}

export default PlayListQuery
