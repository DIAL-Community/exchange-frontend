import { useCallback, useContext, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { DEFAULT_PAGE_SIZE, DisplayType } from '../utils/constants'
import { FilterContext } from '../context/FilterContext'
import {
  CUSTOM_PAGINATED_RESOURCES_QUERY,
  CUSTOM_RESOURCE_PAGINATION_ATTRIBUTES_QUERY
} from '../shared/query/resource'
import Pagination from '../shared/Pagination'
import { Error, Loading, NotFound } from '../shared/FetchStatus'
import ResourceCard from './ResourceCard'

const ResourceListContent = ({ pageOffset, defaultPageSize }) => {
  const { search } = useContext(FilterContext)

  const { loading, error, data } = useQuery(CUSTOM_PAGINATED_RESOURCES_QUERY, {
    variables: {
      search,
      limit: defaultPageSize,
      offset: pageOffset
    }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.paginatedResources && !data?.spotlightResources && !data?.featuredResources) {
    return <NotFound />
  }

  const { featuredResources, spotlightResources, paginatedResources } = data

  return (
    <div className='flex flex-col gap-3'>
      {spotlightResources.map((resource, index) =>
        <div key={index}>
          <ResourceCard
            index={index}
            resource={resource}
            displayType={DisplayType.SPOTLIGHT_CARD}
          />
        </div>
      )}
      <div className='flex flex-row gap-x-3'>
        {featuredResources.map((resource, index) =>
          <div key={index}>
            <ResourceCard
              index={index}
              resource={resource}
              displayType={DisplayType.FEATURED_CARD}
            />
          </div>
        )}
      </div>
      {paginatedResources.map((resource, index) =>
        <div key={index}>
          <ResourceCard
            index={index}
            resource={resource}
            displayType={DisplayType.LARGE_CARD}
          />
        </div>
      )}
    </div>
  )
}

const ResourceList = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { search } = useContext(FilterContext)

  const [pageNumber, setPageNumber] = useState(0)
  const [pageOffset, setPageOffset] = useState(0)
  const topRef = useRef(null)

  const handlePageClick = (event) => {
    setPageNumber(event.selected)
    setPageOffset(event.selected * DEFAULT_PAGE_SIZE)

    if (topRef && topRef.current) {
      topRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start'
      })
    }
  }

  const { loading, error, data } = useQuery(CUSTOM_RESOURCE_PAGINATION_ATTRIBUTES_QUERY, {
    variables: {
      search
    }
  })

  return (
    <div className='px-4 lg:px-8 xl:px-56'>
      <ResourceListContent
        pageOffset={pageOffset}
        defaultPageSize={DEFAULT_PAGE_SIZE}
      />
      { loading && format('ui.pagination.loadingInfo') }
      { error && format('ui.pagination.loadingInfoError') }
      { data &&
        <Pagination
          pageNumber={pageNumber}
          totalCount={data.paginationAttributeResource.totalCount}
          defaultPageSize={DEFAULT_PAGE_SIZE}
          onClickHandler={handlePageClick}
        />
      }
    </div>
  )
}

export default ResourceList
