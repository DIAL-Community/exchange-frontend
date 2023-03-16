import { useQuery } from '@apollo/client'
import { useIntl } from 'react-intl'
import { useCallback, useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'
import { Loading, Error } from '../../shared/FetchStatus'
import { WIZARD_PAGINATED_DATASETS } from '../../../queries/wizard'
import DatasetCard from '../../datasets/DatasetCard'

const DEFAULT_PAGE_SIZE = 5

const PagedDatasetList = ({ sectors, tags, datasetSortHint }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [itemOffset, setItemOffset] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)

  const { loading, error, data, fetchMore } = useQuery(WIZARD_PAGINATED_DATASETS, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      offset: itemOffset,
      sectors,
      tags,
      datasetSortHint,
    }
  })

  useEffect(() => {
    fetchMore({
      variables: {
        first: DEFAULT_PAGE_SIZE,
        offset: itemOffset,
        sectors,
        tags,
        datasetSortHint,
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemOffset])

  const handlePageClick = (event) => {
    setCurrentPage(event.selected)
    setItemOffset(event.selected * DEFAULT_PAGE_SIZE)
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error />
  }

  return (
    <>
      <div className='pb-4 text-sm'>
        {data.paginatedDatasets.nodes?.length
          ? format('wizard.results.datasetsDesc')
          : format('wizard.results.noDatasets')}
      </div>
      {
        data.paginatedDatasets.nodes?.map(
          (dataset) =>
            <DatasetCard key={dataset.id} dataset={dataset} filterDisplayed listType='list' newTab />
        )
      }
      <ReactPaginate
        breakLabel='...'
        nextLabel={format('paginatedSection.page.next.label')}
        forcePage={currentPage}
        onPageChange={handlePageClick}
        pageRangeDisplayed={DEFAULT_PAGE_SIZE}
        pageCount={Math.ceil((itemOffset + data.paginatedDatasets.totalCount) / DEFAULT_PAGE_SIZE)}
        previousLabel={format('paginatedSection.page.previous.label')}
        renderOnZeroPageCount={null}
        breakLinkClassName='relative block py-1.5 px-3 border border-dial-gray -ml-px'
        containerClassName='flex mb-3 mt-3 ml-auto border-3 border-transparent'
        pageLinkClassName='relative block py-1.5 px-3 border border-dial-gray -ml-px'
        activeLinkClassName='bg-dial-sunshine border-dial-sunshine'
        previousLinkClassName='relative block py-1.5 px-3 border border-dial-gray'
        nextLinkClassName='relative block py-1.5 px-3 border border-dial-gray -ml-px'
        disabledLinkClassName='text-dial-gray'
      />
    </>
  )
}

export default PagedDatasetList
