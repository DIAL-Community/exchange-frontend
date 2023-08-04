import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { OrganizationFilterContext } from '../../../../../components/context/OrganizationFilterContext'
import { ORGANIZATION_PAGINATION_ATTRIBUTES_QUERY } from '../../../shared/query/organization'
import { DEFAULT_PAGE_SIZE } from '../../../utils/constants'
import Pagination from '../../../shared/Pagination'
import ListStructure from './ListStructure'
import OrganizationSearchBar from './OrganizationSearchBar'

const OrganizationListRight = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { search } = useContext(OrganizationFilterContext)
  const { sectors } = useContext(OrganizationFilterContext)

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
  }, [search, sectors])

  const { loading, error, data } = useQuery(ORGANIZATION_PAGINATION_ATTRIBUTES_QUERY, {
    variables: {
      search,
      sectors: sectors.map(sector => sector.value),
    }
  })

  return (
    <>
      <OrganizationSearchBar ref={topRef} />
      <ListStructure
        pageOffset={pageOffset}
        defaultPageSize={DEFAULT_PAGE_SIZE}
      />
      { loading && format('ui.pagination.loadingInfo') }
      { error && format('ui.pagination.loadingInfoError') }
      { data &&
        <Pagination
          pageNumber={pageNumber}
          totalCount={data.paginationAttributeOrganization.totalCount}
          defaultPageSize={DEFAULT_PAGE_SIZE}
          pageClickHandler={handlePageClick}
        />
      }
    </>
  )
}

export default OrganizationListRight
