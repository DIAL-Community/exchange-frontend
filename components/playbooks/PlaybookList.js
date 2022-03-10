import { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { gql, useQuery } from '@apollo/client'
import InfiniteScroll from 'react-infinite-scroll-component'
import { HiSortAscending } from 'react-icons/hi'

import PlaybookCard from './PlaybookCard'
import { PlaybookFilterContext } from '../context/PlaybookFilterContext'
import { FilterContext } from '../context/FilterContext'
import { Loading, Error } from '../shared/FetchStatus'

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
      tags
      playbookDescription {
        overview
      }
    }
  }
}
`

const PlaybookList = (props) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const filterDisplayed = props.filterDisplayed
  const displayType = props.displayType
  const gridStyles = `grid ${displayType === 'card'
    ? `grid-cols-1 gap-4
       ${filterDisplayed ? 'lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3' : 'md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'}`
    : 'grid-cols-1'
    }`

  return (
    <>
      <div className={gridStyles}>
        {
          displayType === 'list' &&
            <div className='flex flex-col md:flex-row flex-wrap my-3 px-4 gap-x-4'>
              <div className='ml-2 text-sm font-semibold opacity-70'>
                {format('playbook.header').toUpperCase()}
                <HiSortAscending className='hidden ml-1 inline text-2xl' />
              </div>
              <div className='hidden md:block ml-auto text-sm font-semibold opacity-50'>
                {format('playbooks.tags').toUpperCase()}
                <HiSortAscending className='hidden ml-1 inline text-2xl' />
              </div>
            </div>
        }
        {
          props.playbookList.length > 0
            ? props.playbookList.map((playbook) => (
              <PlaybookCard key={playbook.id} listType={displayType} {...{ playbook, filterDisplayed }} />
              ))
            : (
              <div className='col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 px-1'>
                {format('noResults.entity', { entity: format('playbooks.label') })}
              </div>
              )
        }
      </div>
    </>
  )
}

const PlaybookListQuery = () => {
  const { locale } = useRouter()
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const { displayType, filterDisplayed, resultCounts, setResultCounts } = useContext(FilterContext)
  const { search } = useContext(PlaybookFilterContext)

  const { loading, error, data, fetchMore, refetch } = useQuery(PLAYBOOKS_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      search: search
    },
    context: { headers: { 'Accept-Language': locale } }
  })

  const handleLoadMore = () => {
    fetchMore({
      variables: {
        first: DEFAULT_PAGE_SIZE,
        after: pageInfo.endCursor,
        search: search
      }
    })
  }

  useEffect(() => {
    refetch()
  }, [locale])

  useEffect(() => {
    if (data) {
      setResultCounts({
        ...resultCounts,
        ...{ [['filter.entity.playbooks']]: data.searchPlaybooks.totalCount }
      })
    }
  }, [data])

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error />
  }

  const { searchPlaybooks: { nodes, pageInfo } } = data

  return (
    <>
      <InfiniteScroll
        className='relative px-2 mt-3 pb-8 max-w-catalog mx-auto'
        dataLength={nodes.length}
        next={handleLoadMore}
        hasMore={pageInfo.hasNextPage}
        loader={<div className='relative text-center mt-3'>{format('general.loadingData')}</div>}
      >
        <PlaybookList playbookList={nodes} displayType={displayType} filterDisplayed={filterDisplayed} />
      </InfiniteScroll>
    </>
  )
}

export default PlaybookListQuery
