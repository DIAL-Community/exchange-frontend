import { useCallback, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import ResourceCard from '../../resources/fragments/ResourceCard'
import { DisplayType } from '../../utils/constants'
import HubPagination from './HubPagination'
import HubResourceFilter from './HubResourceFilter'

const DEFAULT_PAGE_SIZE = 6

const HubCountryResources = ({ country }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [pageNumber, setPageNumber] = useState(0)
  const [displayedResources, setDisplayedResources] = useState([])

  useEffect(() => {
    setDisplayedResources(
      country.resources.slice(
        0,
        DEFAULT_PAGE_SIZE
      )
    )
  }, [country])

  const onClickHandler = useCallback(({ nextSelectedPage, selected }) => {
    const destinationPage = typeof nextSelectedPage  === 'undefined' ? selected : nextSelectedPage
    setPageNumber(destinationPage)
    setDisplayedResources(
      country.resources.slice(
        destinationPage * DEFAULT_PAGE_SIZE,
        (destinationPage + 1) * DEFAULT_PAGE_SIZE
      )
    )
  }, [country])

  return (
    <div className='resource-section'>
      <div className='px-4 lg:px-8 xl:px-56 flex flex-col'>
        <div className='text-xl font-medium text-center py-6'>
          {format('hub.topic.reports')}
        </div>
        <hr className='border-b border-gray-300 border-dashed mb-6' />
        <HubResourceFilter />
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8'>
          {displayedResources.map((resource, index) =>
            <ResourceCard key={index} resource={resource} displayType={DisplayType.HUB_CARD} />
          )}
        </div>
        <HubPagination
          pageNumber={pageNumber}
          totalCount={country.resources.length}
          defaultPageSize={DEFAULT_PAGE_SIZE}
          onClickHandler={onClickHandler}
          theme='dark'
        />
      </div>
    </div>
  )
}

export default HubCountryResources
