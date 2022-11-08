import { useCallback, useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { gql, useQuery } from '@apollo/client'
import InfiniteScroll from 'react-infinite-scroll-component'
import { HiSortAscending } from 'react-icons/hi'
import { FilterContext } from '../context/FilterContext'
import { UseCaseFilterContext } from '../context/UseCaseFilterContext'
import { Loading, Error } from '../shared/FetchStatus'
import UseCaseCard from './UseCaseCard'

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
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const filterDisplayed = props.filterDisplayed
  const displayType = props.displayType
  const gridStyles = `grid ${displayType === 'card'
    ? `grid-cols-1 gap-4
       ${filterDisplayed ? 'md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'}`
    : 'grid-cols-1'
    }`

  return (
    <>
      <div className={gridStyles}>
        {
          displayType === 'list' &&
            <div className='grid grid-cols-12 gap-4 my-3 px-4 text-use-case'>
              <div className='col-span-9 md:col-span-10 lg:col-span-4 ml-2 text-sm font-semibold opacity-80'>
                {format('useCase.header').toUpperCase()}
                <HiSortAscending className='hidden ml-1 inline text-2xl' />
              </div>
              <div
                className={`
                  hidden ${filterDisplayed ? 'xl:block' : 'lg:block'}
                  col-span-2 text-sm font-semibold opacity-50'
                `}
              >
                {format('sdg.sdgTargets').toUpperCase()}
                <HiSortAscending className='hidden ml-1 inline text-2xl' />
              </div>
              <div
                className={`
                  hidden ${filterDisplayed ? 'xl:block' : 'lg:block'}
                  col-span-5 text-sm text-workflow font-semibold opacity-50
                `}
              >
                {format('exampleOf.entity', { entity: format('workflow.header') }).toUpperCase()}
                <HiSortAscending className='hidden ml-1 inline text-2xl' />
              </div>
            </div>
        }
        {
          props.useCaseList.length > 0
            ? props.useCaseList.map((useCase) => (
              <UseCaseCard key={useCase.id} listType={displayType} {...{ useCase, filterDisplayed }} />
            ))
            : (
              <div className='col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 px-1'>
                {format('noResults.entity', { entity: format('useCase.label').toLowerCase() })}
              </div>
            )
        }
      </div>
    </>
  )
}

const UseCaseListQuery = () => {
  const { resultCounts, filterDisplayed, displayType, setResultCounts } = useContext(FilterContext)
  const { sdgs, showBeta, search } = useContext(UseCaseFilterContext)

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data, fetchMore } = useQuery(USE_CASES_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      sdgs: sdgs.map(sdg => sdg.value),
      showBeta,
      search
    }
  })

  const handleLoadMore = () => {
    fetchMore({
      variables: {
        after: pageInfo.endCursor,
        first: DEFAULT_PAGE_SIZE,
        sdgs: sdgs.map(sdg => sdg.value),
        showBeta
      }
    })
  }

  useEffect(() => {
    if (data) {
      setResultCounts({
        ...resultCounts,
        ...{ [['filter.entity.useCases']]: data.searchUseCases.totalCount }
      })
    }
  }, [data])

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error />
  }

  const { searchUseCases: { nodes, pageInfo } } = data

  return (
    <>
      <InfiniteScroll
        className='relative px-2 mt-3 pb-8 infinite-scroll-default-height'
        dataLength={nodes.length}
        next={handleLoadMore}
        hasMore={pageInfo.hasNextPage}
        loader={<div className='relative text-center mt-3'>{format('general.loadingData')}</div>}
      >
        <UseCaseList useCaseList={nodes} displayType={displayType} filterDisplayed={filterDisplayed} />
      </InfiniteScroll>
    </>
  )
}

export default UseCaseListQuery
