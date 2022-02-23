import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { gql, useQuery } from '@apollo/client'
import InfiniteScroll from 'react-infinite-scroll-component'
import { HiSortAscending } from 'react-icons/hi'

import PlaybookCard from './PlaybookCard'
import { PlaybookFilterContext, PlaybookFilterDispatchContext } from '../context/PlaybookFilterContext'
import { FilterContext } from '../context/FilterContext'
import { Loading, Error } from '../shared/FetchStatus'
import { TagAutocomplete } from '../filter/element/Tag'

const DEFAULT_PAGE_SIZE = 20

const PLAYBOOKS_QUERY = gql`
query SearchPlaybooks(
  $first: Int,
  $after: String,
  $search: String!
  ) {
  searchPlaybooks(
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
      playbookDescriptions {
        overview
      }
    }
  }
}
`

const PlaybookList = (props) => {
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
              <div className='col-span-5 ml-2 text-sm font-semibold opacity-70'>
                {format('playbook.header').toUpperCase()}
                <HiSortAscending className='hidden ml-1 inline text-2xl' />
              </div>
              <div className='hidden md:block col-span-3 text-sm font-semibold opacity-50'>
                {format('playbook.website').toUpperCase()}
                <HiSortAscending className='hidden ml-1 inline text-2xl' />
              </div>
            </div>
        }
        {
          props.playbookList.length > 0
            ? props.playbookList.map((playbook) => (
              <PlaybookCard key={playbook.id} playbook={playbook} listType={displayType} />
              ))
            : (
              <div className='flex justify-self-center text-dial-gray-dark'>{
                format('noResults.entity', { entity: format('playbooks.label') })
              }
              </div>
              )
        }
      </div>
    </>
  )
}

const PlaybookListQuery = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const { tags } = useContext(PlaybookFilterContext)
  const { setTags } = useContext(PlaybookFilterDispatchContext)

  const { displayType } = useContext(FilterContext)
  const { search } = useContext(PlaybookFilterContext)
  const { loading, error, data, fetchMore } = useQuery(PLAYBOOKS_QUERY, {
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

  const { searchPlaybooks: { nodes, pageInfo } } = data

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
        className='relative px-2 mt-3 pb-8 max-w-catalog mx-auto'
        dataLength={nodes.length}
        next={handleLoadMore}
        hasMore={pageInfo.hasNextPage}
        loader={<div className='relative text-center mt-3'>{format('general.loadingData')}</div>}
      >
        <PlaybookList playbookList={nodes} displayType={displayType} />
      </InfiniteScroll>
    </>
  )
}

export default PlaybookListQuery
