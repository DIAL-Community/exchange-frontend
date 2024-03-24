import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import ReactPaginate from 'react-paginate'

const DpiPagination = ({ pageNumber, totalCount, defaultPageSize, onClickHandler, theme }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const firstRecord = pageNumber * defaultPageSize + 1
  const lastRecord = (pageNumber + 1) * defaultPageSize > totalCount
    ? totalCount
    : (pageNumber + 1) * defaultPageSize

  return (
    <div className={`flex flex-col gap-y-4 my-6 ${theme === 'light' && 'text-dial-slate-300'}`}>
      <hr className='border-b border-dial-slate-300'/>
      <div className='flex flex-col xl:flex-row gap-x-16 gap-y-3'>
        <div className='my-auto text-sm font-semibold'>
          {totalCount <= 0 && format('ui.pagination.noRecord')}
          {totalCount > 0 && format('ui.pagination.showingLabel', {
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
          onClick={onClickHandler}
          pageRangeDisplayed={1}
          marginPagesDisplayed={1}
          pageCount={Math.ceil(totalCount / defaultPageSize)}
          renderOnZeroPageCount={null}
          disabledClassName='opacity-30'
          breakClassName='my-auto'
          // Flex the main container and add gap
          containerClassName='flex gap-x-3 text-sm'
          // Each will have rounded border
          pageClassName='border border-current rounded-md'
          activeClassName={`${theme === 'light' && 'text-white'} font-semibold`}
          // Set the width, height, leading and text center to center text
          pageLinkClassName='block w-10 h-10 leading-10 text-center'
          // Previous and next link will have similar treatment
          previousClassName='border border-current rounded-md'
          previousLinkClassName='block w-10 h-10 leading-10 text-center'
          nextClassName='border border-current rounded-md'
          nextLinkClassName='block w-10 h-10 leading-10 text-center'
        />
      </div>
      <hr className='border-b border-dial-slate-300'/>
    </div>
  )

}

export default DpiPagination
