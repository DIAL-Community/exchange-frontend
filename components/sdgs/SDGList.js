import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import InfiniteScroll from 'react-infinite-scroll-component'

import SDGCard from './SDGCard'
import { SDGFilterContext } from '../context/SDGFilterContext'
import { FilterResultContext } from '../context/FilterResultContext'
import { HiSortAscending } from 'react-icons/hi'
import { Loading, Error } from '../shared/FetchStatus'

const DEFAULT_PAGE_SIZE = 20

const SDGS_QUERY = gql`
query SearchSDGs(
  $first: Int,
  $after: String,
  $sdgs: [String!],
  $search: String!
  ) {
  searchSdgs(
    first: $first,
    after: $after,
    sdgs: $sdgs,
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
      name
      slug
      imageFile
      longTitle
      sdgTargets {
        id
        name
        targetNumber
        useCases {
          id
          slug
          name
          imageFile
        }
      }
    }
  }
}
`

const SDGList = (props) => {
  const displayType = props.displayType
  const gridStyles = `grid ${displayType === 'card' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4' : 'grid-cols-1'}`

  return (
    <>
      <div className={gridStyles}>
        {
          displayType === 'list' &&
            <div className='grid grid-cols-1 md:grid-cols-6 gap-4 my-3 px-4'>
              <div className='col-span-5 md:col-span-3 lg:col-span-2 ml-2 whitespace-nowrap text-sm font-semibold text-sdg opacity-80'>
                {'Sustainable Development Goals'.toUpperCase()}
                <HiSortAscending className='ml-1 inline text-2xl' />
              </div>
              <div className='hidden md:block md:col-span-3 lg:col-span-4 text-sm font-semibold text-use-case opacity-50'>
                {'Example Use Cases'.toUpperCase()}
                <HiSortAscending className='ml-1 inline text-2xl' />
              </div>
            </div>
        }
        {
          props.sdgList.map((sdg) => (
            <SDGCard key={sdg.id} sdg={sdg} listType={displayType} />
          ))
        }
      </div>
    </>
  )
}

const SDGListQuery = () => {
  const { resultCounts, setResultCounts } = useContext(FilterResultContext)
  const { sdgs, search, displayType } = useContext(SDGFilterContext)

  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const { loading, error, data, fetchMore } = useQuery(SDGS_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      sdgs: sdgs.map(organization => organization.value),
      search: search
    },
    onCompleted: (data) => {
      setResultCounts({ ...resultCounts, ...{ [['filter.entity.sdgs']]: data.searchSdgs.totalCount } })
    }
  })

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error />
  }

  const { searchSdgs: { nodes, pageInfo } } = data

  function handleLoadMore () {
    fetchMore({
      variables: {
        after: pageInfo.endCursor,
        first: DEFAULT_PAGE_SIZE,
        sdgs: sdgs.map(sdg => sdg.value),
        search: search
      }
    })
  }
  return (
    <InfiniteScroll
      className='relative mx-2 mt-3'
      dataLength={nodes.length}
      next={handleLoadMore}
      hasMore={pageInfo.hasNextPage}
      loader={<div className='relative text-center mt-3'>{format('general.loadingData')}</div>}
    >
      <SDGList sdgList={nodes} displayType={displayType} />
    </InfiniteScroll>
  )
}

export default SDGListQuery
