import { useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { gql, useQuery } from '@apollo/client'
import InfiniteScroll from 'react-infinite-scroll-component'
import { HiSortAscending } from 'react-icons/hi'
import { FilterContext } from '../context/FilterContext'
import { SDGFilterContext } from '../context/SDGFilterContext'
import { Loading, Error } from '../shared/FetchStatus'
import SDGCard from './SDGCard'

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
            <div className='grid grid-cols-1 md:grid-cols-6 gap-4 my-3 px-4'>
              <div className='col-span-5 md:col-span-3 lg:col-span-2 whitespace-nowrap text-sm font-semibold text-sdg opacity-80'>
                {format('sdg.header').toUpperCase()}
                <HiSortAscending className='hidden ml-1 inline text-2xl' />
              </div>
              <div
                className={`
                  hidden ${filterDisplayed ? 'xl:block' : 'lg:block'}
                  md:col-span-3 lg:col-span-4 text-sm font-semibold text-use-case opacity-50
                `}
              >
                {format('exampleOf.entity', { entity: format('useCase.header') }).toUpperCase()}
                <HiSortAscending className='hidden ml-1 inline text-2xl' />
              </div>
            </div>
        }
        {
          props.sdgList.length > 0
            ? props.sdgList.map((sdg) => (
              <SDGCard key={sdg.id} listType={displayType} {...{ sdg, filterDisplayed }} />
            ))
            : (
              <div className='col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 px-1'>
                {format('noResults.entity', { entity: format('sdg.label').toLowerCase() })}
              </div>
            )
        }
      </div>
    </>
  )
}

const SDGListQuery = () => {
  const { displayType, filterDisplayed, resultCounts, setResultCounts } = useContext(FilterContext)
  const { sdgs, search } = useContext(SDGFilterContext)

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const { loading, error, data, fetchMore } = useQuery(SDGS_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      sdgs: sdgs.map(organization => organization.value),
      search: search
    }
  })

  const handleLoadMore = () => {
    fetchMore({
      variables: {
        after: pageInfo.endCursor,
        first: DEFAULT_PAGE_SIZE,
        sdgs: sdgs.map(sdg => sdg.value),
        search: search
      }
    })
  }

  useEffect(() => {
    if (data) {
      setResultCounts({
        ...resultCounts,
        ...{ [['filter.entity.sdgs']]: data.searchSdgs.totalCount }
      })
    }
  }, [data])

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error />
  }

  const { searchSdgs: { nodes, pageInfo } } = data

  return (
    <InfiniteScroll
      className='relative px-2 mt-3 pb-8 max-w-catalog mx-auto infinite-scroll-default-height'
      dataLength={nodes.length}
      next={handleLoadMore}
      hasMore={pageInfo.hasNextPage}
      loader={<div className='relative text-center mt-3'>{format('general.loadingData')}</div>}
    >
      <SDGList sdgList={nodes} displayType={displayType} filterDisplayed={filterDisplayed} />
    </InfiniteScroll>
  )
}

export default SDGListQuery
