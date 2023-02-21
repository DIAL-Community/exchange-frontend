import { useCallback, useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import InfiniteScroll from 'react-infinite-scroll-component'
import { FilterContext } from '../context/FilterContext'
import { SDGFilterContext } from '../context/SDGFilterContext'
import NotFound from '../shared/NotFound'
import { Loading, Error } from '../shared/FetchStatus'
import { SDGS_QUERY } from '../../queries/sdg'
import SDGCard from './SDGCard'

const DEFAULT_PAGE_SIZE = 20

const SDGList = (props) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const displayType = props.displayType
  const gridStyles = `
    grid grid-cols-1
    ${displayType === 'card' && 'md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4'}
  `

  return (
    <>
      <div className={gridStyles}>
        {
          displayType === 'list' &&
            <div className='grid grid-cols-1 lg:grid-cols-7 gap-4 my-3 px-4 text-sm'>
              <div className='col-span-1 lg:col-span-3 font-semibold text-dial-sapphire opacity-80'>
                {format('sdg.header').toUpperCase()}
              </div>
              <div className='hidden lg:grid lg:col-span-4 font-semibold text-dial-stratos opacity-80'>
                {format('exampleOf.entity', { entity: format('useCase.header') }).toUpperCase()}
              </div>
            </div>
        }
        {
          props.sdgList.length > 0
            ? props.sdgList.map((sdg) => <SDGCard key={sdg.id} listType={displayType} sdg={sdg} />)
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
  const { displayType, setResultCounts } = useContext(FilterContext)
  const { sdgs, search } = useContext(SDGFilterContext)

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data, fetchMore } = useQuery(SDGS_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      sdgs: sdgs.map(organization => organization.value),
      search
    }
  })

  const handleLoadMore = () => {
    fetchMore({
      variables: {
        after: pageInfo.endCursor,
        first: DEFAULT_PAGE_SIZE,
        sdgs: sdgs.map(sdg => sdg.value),
        search
      }
    })
  }

  useEffect(() => {
    if (data) {
      setResultCounts(resultCounts => {
        return {
          ...resultCounts,
          ...{ [['filter.entity.sdgs']]: data.searchSdgs.totalCount }
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

  const { searchSdgs: { nodes, pageInfo } } = data

  return (
    <InfiniteScroll
      className='relative infinite-scroll-default-height'
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
