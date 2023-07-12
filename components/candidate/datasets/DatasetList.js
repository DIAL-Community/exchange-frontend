import { useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import InfiniteScroll from 'react-infinite-scroll-component'
import { DatasetFilterContext } from '../../context/candidate/DatasetFilterContext'
import { FilterContext } from '../../context/FilterContext'
import NotFound from '../../shared/NotFound'
import { Loading, Error } from '../../shared/FetchStatus'
import { CANDIDATE_DATASETS_QUERY } from '../../../queries/candidate'
import { DEFAULT_PAGE_SIZE } from '../../../lib/constants'
import DatasetCard from './DatasetCard'

const DatasetList = ({ datasetList, displayType, filterDisplayed }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

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
            <div className='flex flex-row gap-3 px-3'>
              <div className='w-1/2 opacity-70'>
                {format('dataset.header').toUpperCase()}
              </div>
            </div>
        }
        {
          datasetList.length
            ? datasetList.map((dataset) => (
              <DatasetCard key={dataset.id} listType={displayType} {...{ filterDisplayed, dataset }} />
            ))
            : (
              <div className='text-dial-gray-dark'>{
                format('noResults.entity', { entity: format('datasets.label') })
              }
              </div>
            )
        }
      </div>
    </>
  )
}

const DatasetListQuery = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const { search } = useContext(DatasetFilterContext)
  const { filterDisplayed, displayType, setResultCounts } = useContext(FilterContext)

  const { loading, error, data, fetchMore } = useQuery(CANDIDATE_DATASETS_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      search
    }
  })

  const handleLoadMore = () => {
    fetchMore({
      variables: {
        first: DEFAULT_PAGE_SIZE,
        after: pageInfo.endCursor,
        search
      }
    })
  }

  useEffect(() => {
    if (data) {
      setResultCounts(resultCounts => {
        return {
          ...resultCounts,
          ...{ [['filter.entity.candidateDatasets']]: data.searchCandidateDatasets.totalCount }
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

  const { searchCandidateDatasets: { nodes, pageInfo } } = data

  return (
    <InfiniteScroll
      className='relative infinite-scroll-default-height'
      dataLength={nodes.length}
      next={handleLoadMore}
      hasMore={pageInfo.hasNextPage}
      loader={<div className='relative text-center mt-3'>{format('general.loadingData')}</div>}
    >
      <DatasetList datasetList={nodes} displayType={displayType} filterDisplayed={filterDisplayed} />
    </InfiniteScroll>
  )
}

export default DatasetListQuery
