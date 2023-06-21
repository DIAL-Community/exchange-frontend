import { useState } from 'react'
import ListStructure from './list/ListStructure'
import PaginationStructure from './list/PaginationStructure'

const UseCaseListRight = () => {
  const [pageNumber, setPageNumber] = useState(0)
  const [pageOffset, setPageOffset] = useState(0)

  const DEFAULT_PAGE_SIZE = 2

  const handlePageClick = (event) => {
    setPageNumber(event.selected)
    setPageOffset(event.selected * DEFAULT_PAGE_SIZE)
  }

  return (
    <>
      <div className='py-8'>
        Filtering part
      </div>
      <ListStructure
        pageOffset={pageOffset}
        defaultPageSize={DEFAULT_PAGE_SIZE}
      />
      <PaginationStructure
        pageNumber={pageNumber}
        defaultPageSize={DEFAULT_PAGE_SIZE}
        pageClickHandler={handlePageClick}
      />
    </>
  )
}

export default UseCaseListRight
