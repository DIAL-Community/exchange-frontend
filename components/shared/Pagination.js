import { useCallback, useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { useIntl } from 'react-intl'
import ReactPaginate from 'react-paginate'

const Pagination = ({ pageNumber, totalCount, defaultPageSize, onClickHandler }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [pageRange, setPageRange] = useState(1)

  useEffect(() => {
    if (!isMobile) {
      setPageRange(5)
    }
  }, [])

  const firstRecord = pageNumber * defaultPageSize + 1
  const lastRecord = (pageNumber + 1) * defaultPageSize > totalCount
    ? totalCount
    : (pageNumber + 1) * defaultPageSize

  return (
    <div className='flex flex-col gap-y-4 my-6'>
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
        {pageNumber < Math.ceil(totalCount / defaultPageSize) &&
          <ReactPaginate
            breakLabel='...'
            nextLabel={format('ui.pagination.nextLabel')}
            previousLabel={format('ui.pagination.prevLabel')}
            forcePage={pageNumber}
            onClick={onClickHandler}
            pageRangeDisplayed={pageRange}
            marginPagesDisplayed={1}
            pageCount={Math.ceil(totalCount / defaultPageSize)}
            renderOnZeroPageCount={null}
            disabledClassName='opacity-30'
            breakClassName='my-auto'
            // Flex the main container and add gap
            containerClassName='flex gap-x-3 text-sm text-dial-slate-300 font-semibold'
            // Each will have rounded border
            pageClassName='border border-current rounded-md'
            activeClassName='text-dial-iris-blue'
            // Set the width, height, leading and text center to center text
            pageLinkClassName='block w-10 h-10 leading-10 text-center text-dial-slate-500'
            // Previous and next link will have similar treatment
            previousClassName='border border-current rounded-md'
            previousLinkClassName='block w-10 h-10 leading-10 text-center text-dial-slate-500'
            nextClassName='border border-current rounded-md'
            nextLinkClassName='block w-10 h-10 leading-10 text-center text-dial-slate-500'
          />
        }
      </div>
      <hr className='border-b border-dial-slate-300'/>
    </div>
  )

}

export default Pagination
