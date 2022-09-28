import { useCallback, useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { gql, useQuery } from '@apollo/client'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useSession } from 'next-auth/react'
import { Loading, Error } from '../shared/FetchStatus'
import { FilterContext } from '../context/FilterContext'
import { PlaybookFilterContext } from '../context/PlaybookFilterContext'
import PlaybookCard from './PlaybookCard'

const DEFAULT_PAGE_SIZE = 20

export const PLAYBOOKS_QUERY = gql`
  query SearchPlaybooks(
    $first: Int,
    $after: String,
    $search: String!,
    $tags: [String!],
    $products: [String!]
    ) {
    searchPlaybooks(
      first: $first,
      after: $after,
      search: $search,
      products: $products,
      tags: $tags
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
          id
          overview
        }
        draft
      }
    }
  }
`

const PlaybookList = (props) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { data: session } = useSession()

  const canEdit = session?.user?.canEdit

  const filterDisplayed = props.filterDisplayed
  const displayType = props.displayType
  const gridStyles = `grid ${displayType === 'card'
    ? `grid-cols-1 gap-4
       ${filterDisplayed ? 'md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'}`
    : 'grid-cols-1'
    }`

  return (
    <div className={gridStyles}>
      {
        displayType === 'list' &&
          <div className='flex flex-col md:flex-row flex-wrap my-3 px-4 gap-x-4'>
            <div className='ml-2 text-sm font-semibold opacity-70'>
              {format('playbook.header').toUpperCase()}
            </div>
            <div className='hidden md:block ml-auto text-sm font-semibold opacity-50'>
              {format('playbooks.tags').toUpperCase()}
            </div>
          </div>
      }
      {
        props.playbookList.length > 0
          ? props.playbookList.map((playbook) => (
            <PlaybookCard key={playbook.id} listType={displayType} {...{ playbook, filterDisplayed }} canEdit={canEdit} />
          ))
          : (
            <div className='text-sm font-medium opacity-80'>
              {format('noResults.entity', { entity: format('playbooks.label').toString().toLowerCase() })}
            </div>
          )
      }
    </div>
  )
}

const PlaybookListQuery = () => {
  const { locale } = useRouter()
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const { displayType, filterDisplayed, resultCounts, setResultCounts } = useContext(FilterContext)
  const { search, tags, products } = useContext(PlaybookFilterContext)

  const { loading, error, data, fetchMore, refetch } = useQuery(PLAYBOOKS_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      search,
      products: products.map(product => product.value),
      tags: tags.map(tag => tag.label)
    },
    context: { headers: { 'Accept-Language': locale } }
  })

  const handleLoadMore = () => {
    fetchMore({
      variables: {
        first: DEFAULT_PAGE_SIZE,
        after: pageInfo.endCursor,
        search,
        products: products.map(product => product.value),
        tags: tags.map(tag => tag.label)
      }
    })
  }

  useEffect(() => {
    refetch()
  }, [locale, refetch])

  useEffect(() => {
    if (data) {
      setResultCounts({
        ...resultCounts,
        ...{ [['filter.entity.playbooks']]: data.searchPlaybooks.totalCount }
      })
    }
  }, [data, setResultCounts])

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
        className='relative px-2 mt-3 pb-8 max-w-catalog mx-auto infinite-scroll-default-height'
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
