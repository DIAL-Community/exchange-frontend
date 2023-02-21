import { useContext, useEffect } from 'react'
import { useIntl, FormattedMessage } from 'react-intl'
import { useQuery } from '@apollo/client'
import InfiniteScroll from 'react-infinite-scroll-component'
import { BuildingBlockFilterContext } from '../context/BuildingBlockFilterContext'
import { FilterContext } from '../context/FilterContext'
import NotFound from '../shared/NotFound'
import { Loading, Error } from '../shared/FetchStatus'
import { BUILDING_BLOCKS_QUERY } from '../../queries/building-block'
import BuildingBlockCard from './BuildingBlockCard'

const DEFAULT_PAGE_SIZE = 20

const BuildingBlockList = (props) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const displayType = props.displayType
  const gridStyles = `grid ${displayType === 'card'
    ? 'grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'
    : 'grid-cols-1'
  }`

  return (
    <>
      <div className={gridStyles}>
        {
          displayType === 'list' &&
            <div className='flex gap-x-2 lg:gap-x-4 px-4 my-3 px-4 text-sm font-semibold '>
              <div className='w-10/12 lg:w-4/12 opacity-80'>
                {format('building-block.header').toUpperCase()}
              </div>
              <div className='hidden lg:block w-8/12 lg:w-3/12 opacity-50'>
                {format('exampleOf.entity', { entity: format('product.header') }).toUpperCase()}
              </div>
              <div className='hidden lg:block w-8/12 lg:w-3/12 opacity-50'>
                {format('exampleOf.entity', { entity: format('workflow.header') }).toUpperCase()}
              </div>
            </div>
        }
        {
          props.buildingBlockList.length > 0
            ? props.buildingBlockList.map((buildingBlock, idx) => (
              <BuildingBlockCard key={idx} listType={displayType} {...{ buildingBlock }} />
            ))
            : (
              <div className='col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 px-1'>
                {format('noResults.entity', { entity: format('building-block.label').toLowerCase() })}
              </div>
            )
        }
      </div>
    </>
  )
}

const BuildingBlockListQuery = () => {
  const { displayType, setResultCounts } = useContext(FilterContext)
  const { sdgs, useCases, workflows, showMature, search } = useContext(BuildingBlockFilterContext)

  const format = (id, value = {}) => <FormattedMessage id={id} values={{ ...value }} />

  const { loading, error, data, fetchMore } = useQuery(BUILDING_BLOCKS_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      sdgs: sdgs.map(sdg => sdg.value),
      useCases: useCases.map(useCase => useCase.value),
      workflows: workflows.map(workflow => workflow.value),
      showMature,
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
        sdgs: sdgs.map(sdg => sdg.value),
        useCases: useCases.map(useCase => useCase.value),
        workflows: workflows.map(workflow => workflow.value),
        showMature,
        search
      }
    })
  }

  useEffect(() => {
    if (data) {
      setResultCounts(resultCounts => {
        return {
          ...resultCounts,
          ...{ [['filter.entity.buildingBlocks']]: data.searchBuildingBlocks.totalCount }
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

  const { searchBuildingBlocks: { nodes, pageInfo } } = data

  return (
    <InfiniteScroll
      className='relative infinite-scroll-default-height'
      dataLength={nodes.length}
      next={handleLoadMore}
      hasMore={pageInfo.hasNextPage}
      loader={<div className='relative text-center mt-3'>{format('general.loadingData')}</div>}
    >
      <BuildingBlockList buildingBlockList={nodes} displayType={displayType} />
    </InfiniteScroll>
  )
}

export default BuildingBlockListQuery
