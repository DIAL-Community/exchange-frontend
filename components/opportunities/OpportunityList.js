import { useCallback, useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import InfiniteScroll from 'react-infinite-scroll-component'
import { FilterContext } from '../context/FilterContext'
import { OpportunityFilterContext } from '../context/OpportunityFilterContext'
import { Loading, Error } from '../shared/FetchStatus'
import NotFound from '../shared/NotFound'
import { OPPORTUNITIES_QUERY } from '../../queries/opportunity'
import OpportunityCard from './OpportunityCard'

const DEFAULT_PAGE_SIZE = 20
const OpportunityList = (props) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const displayType = props.displayType
  const gridStyles = `grid ${displayType === 'card'
    ? 'grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'
    : 'grid-cols-1'
    }`

  return (
    <div className={gridStyles}>
      {displayType === 'list' &&
        <div className='flex flex-col md:flex-row flex-wrap my-3 px-4 gap-x-4'>
          <div className='ml-2 text-sm font-semibold opacity-70'>
            {format('opportunity.header').toUpperCase()}
          </div>
          <div className='hidden md:block ml-auto text-sm font-semibold opacity-50'>
            {format('opportunities.tags').toUpperCase()}
          </div>
        </div>
      }
      {
        props.opportunityList.length > 0
          ? props.opportunityList.map((opportunity, index) =>
            <OpportunityCard key={index} listType={displayType} {...{ opportunity }}/>
          )
          : (
            <div className='text-sm font-medium opacity-80'>
              {format(
                'noResults.entity',
                { entity: format('opportunity.label').toLowerCase() }
              )}
            </div>
          )
      }
    </div>
  )
}

const OpportunityListQuery = () => {
  const { displayType, setResultCounts } = useContext(FilterContext)
  const {
    buildingBlocks,
    countries,
    organizations,
    sectors,
    useCases,
    search,
    showClosed
  } = useContext(OpportunityFilterContext)

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data, fetchMore } = useQuery(OPPORTUNITIES_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      buildingBlocks: buildingBlocks.map(country => country.value),
      countries: countries.map(country => country.value),
      organizations: organizations.map(organization => organization.value),
      sectors: sectors.map(sector => sector.value),
      useCases: useCases.map(useCase => useCase.value),
      showClosed,
      search
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first'
  })

  const handleLoadMore = () => {
    fetchMore({
      variables: {
        after: pageInfo.endCursor,
        first: DEFAULT_PAGE_SIZE,
        countries: countries.map(country => country.value),
        sectors: sectors.map(sector => sector.value),
        search
      }
    })
  }

  useEffect(() => {
    if (data) {
      setResultCounts(resultCounts => {
        return {
          ...resultCounts,
          ...{ [['filter.entity.opportunities']]: data.searchOpportunities.totalCount }
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

  const { searchOpportunities: { nodes, pageInfo } } = data

  return (
    <>
      <InfiniteScroll
        className='relative infinite-scroll-default-height'
        dataLength={nodes.length}
        next={handleLoadMore}
        hasMore={pageInfo.hasNextPage}
        loader={<div className='relative text-center mt-3'>{format('general.loadingData')}</div>}
      >
        <OpportunityList opportunityList={nodes} displayType={displayType} />
      </InfiniteScroll>
    </>
  )
}

export default OpportunityListQuery
