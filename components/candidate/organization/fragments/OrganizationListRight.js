import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { useCallback, useContext, useRef } from 'react'
import { OrganizationFilterContext, OrganizationFilterDispatchContext } from '../../../context/OrganizationFilterContext'
import { CANDIDATE_ORGANIZATION_PAGINATION_ATTRIBUTES_QUERY } from '../../../shared/query/candidateOrganization'
import { DEFAULT_PAGE_SIZE } from '../../../utils/constants'
import Pagination from '../../../shared/Pagination'
import ListStructure from './ListStructure'
import OrganizationSearchBar from './OrganizationSearchBar'

const OrganizationListRight = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { search } = useContext(OrganizationFilterContext)

  const { pageNumber, pageOffset } = useContext(OrganizationFilterContext)
  const { setPageNumber, setPageOffset } = useContext(OrganizationFilterDispatchContext)

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

  const { loading, error, data } = useQuery(CANDIDATE_ORGANIZATION_PAGINATION_ATTRIBUTES_QUERY, {
    variables: {
      search
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
          totalCount={data.paginationAttributeCandidateOrganization.totalCount}
          defaultPageSize={DEFAULT_PAGE_SIZE}
          pageClickHandler={handlePageClick}
        />
      }
    </>
  )
}

export default OrganizationListRight
