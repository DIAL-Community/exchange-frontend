import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import InfiniteScroll from 'react-infinite-scroll-component'

import UseCaseCard from './UseCaseCard'
import { UseCaseFilterContext } from '../context/UseCaseFilterContext'
import { FilterResultContext, convertToKey } from '../context/FilterResultContext'
import { HiSortAscending } from 'react-icons/hi'

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
  const displayType = props.displayType
  const gridStyles = `grid ${displayType === 'card' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4' : 'grid-cols-1'}`

  return (
    <>
      <div className={gridStyles}>
        {
          displayType === 'list' &&
            <div className='grid grid-cols-12 my-3 px-4 text-use-case'>
              <div className='col-span-4 ml-2 text-sm font-semibold opacity-80'>
                {'Use Cases'.toUpperCase()}
                <HiSortAscending className='ml-1 inline text-2xl' />
              </div>
              <div className='col-span-2 text-sm font-semibold opacity-50'>
                {'SDG Targets'.toUpperCase()}
                <HiSortAscending className='ml-1 inline text-2xl' />
              </div>
              <div className='col-span-5 text-sm font-semibold opacity-50'>
                {'Example Workflows'.toUpperCase()}
                <HiSortAscending className='ml-1 inline text-2xl' />
              </div>
              <div className='col-span-1' />
            </div>
        }
        {
          props.useCaseList.map((useCase) => (
            <UseCaseCard key={useCase.id} useCase={useCase} listType={displayType} />
          ))
        }
      </div>
    </>
  )
}

const UseCaseListQuery = () => {
  const { resultCounts, setResultCounts } = useContext(FilterResultContext)
  const { sdgs, showBeta, search, displayType } = useContext(UseCaseFilterContext)

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
      setResultCounts({ ...resultCounts, ...{ [`${convertToKey('Use Cases')}`]: data.searchUseCases.totalCount } })
    }
  })

  if (loading) {
    return <div className='relative text-center my-3'>{format('general.fetchingData')}</div>
  }

  if (error) {
    return <div className='relative text-center my-3 default-height'>{format('general.fetchError')}</div>
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
      className='relative mx-2 mt-3'
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
