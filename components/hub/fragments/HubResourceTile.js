import { useCallback, useEffect, useState } from 'react'
import ResourceCard from '../../resources/fragments/ResourceCard'
import { DisplayType } from '../../utils/constants'
import HubPagination from './HubPagination'
import HubResourceFilter from './HubResourceFilter'

const DEFAULT_PAGE_SIZE = 6

const HubResourceTile = ({ resources }) => {
  const [pageNumber, setPageNumber] = useState(0)
  const [displayedResources, setDisplayedResources] = useState([])

  useEffect(() => {
    setDisplayedResources(
      resources.slice(
        0,
        DEFAULT_PAGE_SIZE
      )
    )
  }, [resources])

  const onClickHandler = useCallback(({ nextSelectedPage, selected }) => {
    const destinationPage = typeof nextSelectedPage  === 'undefined' ? selected : nextSelectedPage
    setPageNumber(destinationPage)
    setDisplayedResources(
      resources.slice(
        destinationPage * DEFAULT_PAGE_SIZE,
        (destinationPage + 1) * DEFAULT_PAGE_SIZE
      )
    )
  }, [resources])

  return (
    <div className='px-4 lg:px-8 xl:px-56 min-h-[70vh] py-8'>
      <HubResourceFilter />
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8'>
        {displayedResources.map((resource, index) =>
          <ResourceCard key={index} resource={resource} displayType={DisplayType.DPI_CARD}  />
        )}
      </div>
      <HubPagination
        pageNumber={pageNumber}
        totalCount={resources.length}
        defaultPageSize={DEFAULT_PAGE_SIZE}
        onClickHandler={onClickHandler}
        theme='dark'
      />
    </div>
  )
}

export default HubResourceTile
