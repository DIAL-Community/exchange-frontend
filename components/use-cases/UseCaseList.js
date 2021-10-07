import { useContext } from 'react'
import { useIntl, FormattedMessage } from 'react-intl'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import InfiniteScroll from 'react-infinite-scroll-component'

import UseCaseCard from './UseCaseCard'
import { UseCaseFilterContext } from '../context/UseCaseFilterContext'
import { FilterContext } from '../context/FilterContext'
import { HiSortAscending } from 'react-icons/hi'
import { Loading, Error } from '../shared/FetchStatus'

const DEFAULT_PAGE_SIZE = 20

const USE_CASES_QUERY = gql`
query SearchUseCases(
  $first: Int,
  $after: String,
  $sdgs: [String!],
  $showBeta: Boolean,
  $search: String!
  ) {
  searchUseCases(
    first: $first,
    after: $after,
    sdgs: $sdgs,
    showBeta: $showBeta,
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
      maturity
      sdgTargets {
        id
        name
        targetNumber
      }
      useCaseSteps {
        id
        name
        workflows {
          id
          name
          slug
          imageFile
        }
      }
    }
  }
}
`
const UseCaseList = (props) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const displayType = props.displayType
  const gridStyles = `grid ${displayType === 'card' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4' : 'grid-cols-1'}`

  return (
    <>
      <div className={gridStyles}>
        {
          displayType === 'list' &&
            <div className='grid grid-cols-12 my-3 px-4 text-use-case'>
              <div className='col-span-9 md:col-span-10 lg:col-span-4 ml-2 text-sm font-semibold opacity-80'>
                {format('useCase.header').toUpperCase()}
                <HiSortAscending className='hidden ml-1 inline text-2xl' />
              </div>
              <div className='hidden lg:block col-span-2 text-sm font-semibold opacity-50'>
                {format('sdg.sdgTargets').toUpperCase()}
                <HiSortAscending className='hidden ml-1 inline text-2xl' />
              </div>
              <div className='hidden lg:block col-span-5 text-sm text-workflow font-semibold opacity-50'>
                {format('exampleOf.entity', { entity: format('workflow.header') }).toUpperCase()}
                <HiSortAscending className='hidden ml-1 inline text-2xl' />
              </div>
              <div className='col-span-1' />
            </div>
        }
        {
          props.useCaseList.length > 0
            ? props.useCaseList.map((useCase) => (
              <UseCaseCard key={useCase.id} useCase={useCase} listType={displayType} />
              ))
            : (
              <div className='flex justify-self-center text-dial-gray-dark'>{
                format('noResults.entity', { entity: format('use-case.label') })
                }
              </div>
              )
        }
      </div>
    </>
  )
}

const UseCaseListQuery = () => {
  const { resultCounts, displayType, setResultCounts } = useContext(FilterContext)
  const { sdgs, showBeta, search } = useContext(UseCaseFilterContext)

  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const { loading, error, data, fetchMore } = useQuery(USE_CASES_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      sdgs: sdgs.map(sdg => sdg.value),
      showBeta: showBeta,
      search: search
    },
    onCompleted: (data) => {
      setResultCounts({ ...resultCounts, ...{ [['filter.entity.useCases']]: data.searchUseCases.totalCount } })
    }
  })

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error />
  }

  const { searchUseCases: { nodes, pageInfo } } = data

  function handleLoadMore () {
    fetchMore({
      variables: {
        after: pageInfo.endCursor,
        first: DEFAULT_PAGE_SIZE,
        sdgs: sdgs.map(sdg => sdg.value),
        showBeta: showBeta
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
      <UseCaseList useCaseList={nodes} displayType={displayType} />
    </InfiniteScroll>
  )
}

export default UseCaseListQuery
