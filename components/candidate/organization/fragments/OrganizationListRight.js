import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import { useCallback, useContext, useRef } from 'react'
import { OrganizationFilterContext } from '../../../context/candidate/OrganizationFilterContext'
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

  const topRef = useRef(null)
  const { push, query } = useRouter()

  const onClickHandler = ({ nextSelectedPage, selected }) => {
    const destinationPage = nextSelectedPage ? nextSelectedPage : selected
    push(
      { query: { ...query, page: destinationPage + 1 } },
      undefined,
      { shallow: true }
    )
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
          onClickHandler={onClickHandler}
        />
      }
    </>
  )
}

export default OrganizationListRight
