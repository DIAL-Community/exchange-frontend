import { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'
import BuildingBlockCard from './BuildingBlockCard'

const PaginatedBuildingBlockList = ({ itemsPerPage, items }) => {
  const [currentItems, setCurrentItems] = useState(null)
  const [pageCount, setPageCount] = useState(0)
  const [itemOffset, setItemOffset] = useState(0)

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage
    setCurrentItems(items.slice(itemOffset, endOffset))
    setPageCount(Math.ceil(items.length / itemsPerPage))
  }, [itemOffset, itemsPerPage])

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items.length
    setItemOffset(newOffset)
  }

  return (
    <>
      {
        currentItems && currentItems.map((buildingBlock) => {
          return (<BuildingBlockCard key={buildingBlock.name} buildingBlock={buildingBlock} listType='list' newTab />)
        })
      }
      <ReactPaginate
        breakLabel='...'
        nextLabel='Next >'
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel='< Previous'
        renderOnZeroPageCount={null}
        containerClassName='flex mb-3 mt-3 ml-auto border-3 border-transparent'
        pageLinkClassName='relative block py-1.5 px-3 border border-dial-gray -ml-px'
        activeLinkClassName='bg-dial-yellow border-dial-yellow'
        previousLinkClassName='relative block py-1.5 px-3 border border-dial-gray'
        nextLinkClassName='relative block py-1.5 px-3 border border-dial-gray -ml-px'
        disabledLinkClassName='text-dial-gray'
      />
    </>
  )
}

export default PaginatedBuildingBlockList
