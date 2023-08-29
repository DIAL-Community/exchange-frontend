import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { FilterContext } from '../../../../components/context/FilterContext'
import { RESOURCE_PAGINATION_ATTRIBUTES_QUERY } from '../../shared/query/resource'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'
import Pagination from '../../shared/Pagination'
import ListStructure from './ListStructure'
import ResourceSearchBar from './ResourceSearchBar'

const ResourceListRight = () => {
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

  useEffect(() => {
    setPageNumber(0)
    setPageOffset(0)
  }, [search])

  const { loading, error, data } = useQuery(RESOURCE_PAGINATION_ATTRIBUTES_QUERY, {
    variables: {
      search
    }
  })

  return (
    <>
      <ResourceSearchBar ref={topRef} />
      <ListStructure
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
    </>
  )
}

export default ResourceListRight
