import { useCallback, useContext, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { DEFAULT_PAGE_SIZE } from '../utils/constants'
import { ResourceFilterContext } from '../context/ResourceFilterContext'
import { CUSTOM_RESOURCE_PAGINATION_ATTRIBUTES_QUERY } from '../shared/query/resource'
import Pagination from '../shared/Pagination'
import ResourceListMain from './fragments/ResourceListMain'

const ResourceList = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { search, resourceTypes, resourceTopics, resourceTags, resourceCountries } = useContext(ResourceFilterContext)

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
      search,
      tags: resourceTags.map(r => r.value),
      countries: resourceCountries.map(r => r.label),
      resourceTypes: resourceTypes.map(r => r.value),
      resourceTopics: resourceTopics.map(r => r.value)
    }
  })

  return (
    <div className='px-4 lg:px-8 xl:px-56'>
      <ResourceListMain
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
          pageClickHandler={handlePageClick}
        />
      }
    </div>
  )
}

export default ResourceList
