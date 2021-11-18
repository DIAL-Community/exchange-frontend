import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import InfiniteScroll from 'react-infinite-scroll-component'
import { HiSortAscending } from 'react-icons/hi'

import PlayCard from './PlayCard'
import { PlayFilterContext, PlayFilterDispatchContext } from '../context/PlayFilterContext'
import { FilterContext } from '../context/FilterContext'
import { Loading, Error } from '../shared/FetchStatus'
import { TagAutocomplete } from '../filter/element/Tag'

const DEFAULT_PAGE_SIZE = 20

const PLAYS_QUERY = gql`
query SearchPlays(
  $first: Int,
  $after: String,
  $search: String!
  ) {
  searchPlays(
    first: $first,
    after: $after,
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
      slug
      name
      imageFile
      playDescriptions {
        description
        locale
      }
    }
  }
}
`

const PlayList = ({ playList, displayType, assignCallback, currentPlays }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const gridStyles = `grid ${displayType === 'card' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4' : 'grid-cols-1'}`

  return (
    <>
      <div className={gridStyles}>
        {
          displayType === 'assign' &&
            <div className='grid grid-cols-12 my-3 px-4'>
              <div className='col-span-5 ml-2 text-sm font-semibold opacity-70'>
                {format('play.header').toUpperCase()}
                <HiSortAscending className='hidden ml-1 inline text-2xl' />
              </div>
              <div className='hidden md:block col-span-3 text-sm font-semibold opacity-50'>
                {format('plays.description').toUpperCase()}
                <HiSortAscending className='hidden ml-1 inline text-2xl' />
              </div>
            </div>
        }
        {
          playList.length > 0
            ? playList.map((play) => {
                return (!currentPlays || !currentPlays.filter(e => e.id === play.id).length > 0) && (
                  <PlayCard key={play.id} play={play} listType={displayType} assignCallback={assignCallback} />
                )
              })
            : (
              <div className='flex justify-self-center text-dial-gray-dark'>{
                format('noResults.entity', { entity: format('plays.label') })
              }
              </div>
              )
        }
      </div>
    </>
  )
}

const PlayListQuery = (props) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })
  const { tags } = useContext(PlayFilterContext)
  const { setTags } = useContext(PlayFilterDispatchContext)

  const { displayType } = props.displayType ? props : useContext(FilterContext)
  const { search } = useContext(PlayFilterContext)
  const { loading, error, data, fetchMore } = useQuery(PLAYS_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      search: search
    }
  })

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error />
  }

  const { searchPlays: { nodes, pageInfo } } = data
  function handleLoadMore () {
    fetchMore({
      variables: {
        first: DEFAULT_PAGE_SIZE,
        after: pageInfo.endCursor,
        search: search
      }
    })
  }
  return (
    <>
      <TagAutocomplete {...{ tags, setTags }} containerStyles='px-2 pb-2' />
      <InfiniteScroll
        className='relative px-2 pb-8 max-w-catalog mx-auto'
        dataLength={nodes.length}
        next={handleLoadMore}
        hasMore={pageInfo.hasNextPage}
        loader={<div className='relative text-center mt-3'>{format('general.loadingData')}</div>}
      >
        <PlayList playList={nodes} displayType={displayType} assignCallback={props.assignCallback} currentPlays={props.currentPlays} />
      </InfiniteScroll>
    </>
  )
}

export default PlayListQuery
