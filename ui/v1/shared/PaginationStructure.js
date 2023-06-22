import { useIntl } from 'react-intl'
import { useCallback, } from 'react'
import ReactPaginate from 'react-paginate'

const PaginationStructure = ({ pageNumber, totalCount, defaultPageSize, pageClickHandler }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const firstRecord = pageNumber * defaultPageSize + 1
  const lastRecord = (pageNumber + 1) * defaultPageSize > totalCount
    ? totalCount
    : (pageNumber + 1) * defaultPageSize

  return (
    <div className='flex flex-col gap-y-4 my-6'>
      <hr className='bg-dial-slate-300'/>
      <div className='flex flex-row gap-x-16'>
        <div className='my-auto text-sm font-semibold'>
          {format('ui.pagination.showingLabel', {
            firstRecord,
            lastRecord,
            totalRecords: totalCount
          })}
        </div>
        <ReactPaginate
          breakLabel='...'
          nextLabel={format('ui.pagination.nextLabel')}
          previousLabel={format('ui.pagination.prevLabel')}
          forcePage={pageNumber}
          onPageChange={pageClickHandler}
          pageRangeDisplayed={1}
          marginPagesDisplayed={2}
          pageCount={Math.ceil(totalCount / defaultPageSize)}
          renderOnZeroPageCount={null}
          // Flex the main container and add gap
          containerClassName='flex gap-x-3 text-sm font-semibold'
          // Each will have rounded border
          pageClassName='border border-dial-slate-300 rounded-md'
          activeClassName='border border-dial-iris-blue'
          // Set the width, height, leading and text center to center text
          pageLinkClassName='block w-10 h-10 leading-10 text-center'
          // Previous and next link will have similar treatment
          previousClassName='border border-dial-slate-300 rounded-md'
          previousLinkClassName='block w-10 h-10 leading-10 text-center'
          nextClassName='border border-dial-slate-300 rounded-md'
          nextLinkClassName='block w-10 h-10 leading-10 text-center'
        />
      </div>
      <hr className='bg-dial-slate-300'/>
    </div>
  )

}

export default PaginationStructure
