import { useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import InfiniteScroll from 'react-infinite-scroll-component'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import ReactTooltip from 'react-tooltip'
import { FilterContext } from '../context/FilterContext'
import { UserFilterContext } from '../context/UserFilterContext'
import { Loading, Error } from '../shared/FetchStatus'
import { SECTORS_LIST_QUERY } from '../../queries/sector'
import NotFound from '../shared/NotFound'
import { DEFAULT_PAGE_SIZE, DisplayType } from '../../lib/constants'
import SectorCard from './SectorCard'

const SectorList = ({ displayType, sectorList }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  return (
    <div className={classNames('grid', { 'grid-cols-1' : displayType === DisplayType.LIST })}>
      {
        sectorList.length
          ? sectorList.map((sector) => (
            <SectorCard key={sector.id} listType={displayType} sector={sector} displayEditButtons/>
          ))
          : (
            <div className='col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 px-6'>
              {format('noResults.entity', { entity: format('sector.label') })}
            </div>
          )
      }
    </div>
  )
}

const SectorListQuery = () => {
  const { resultCounts, setResultCounts } = useContext(FilterContext)
  const { search } = useContext(UserFilterContext)

  const { locale } = useRouter()

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  const { loading, error, data, fetchMore, refetch } = useQuery(SECTORS_LIST_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      search,
      locale
    },
    onCompleted: (data) => {
      setResultCounts({ ...resultCounts, ...{ [['filter.entity.sectors']]: data.searchSectors.totalCount } })
    }
  })

  useEffect(refetch, [refetch, locale])

  useEffect(() => ReactTooltip.rebuild(), [data])

  if (loading) {
    return <Loading />
  } else if (error && error.networkError) {
    return <Error />
  } else if (error && !error.networkError) {
    return <NotFound />
  }

  const { searchSectors: { nodes, pageInfo } } = data

  function handleLoadMore() {
    fetchMore({
      variables: {
        after: pageInfo.endCursor,
        first: DEFAULT_PAGE_SIZE
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
      <SectorList sectorList={nodes} displayType={DisplayType.LIST}/>
      <ReactTooltip className='tooltip-prose bg-dial-gray-dark text-white rounded' />
    </InfiniteScroll>
  )
}

export default SectorListQuery
