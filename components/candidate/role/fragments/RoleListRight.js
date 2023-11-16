import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import { useCallback, useContext, useRef } from 'react'
import { FilterContext } from '../../../context/FilterContext'
import { CANDIDATE_ROLE_PAGINATION_ATTRIBUTES_QUERY } from '../../../shared/query/candidateRole'
import { RoleFilterContext } from '../../../context/candidate/RoleFilterContext'
import { DEFAULT_PAGE_SIZE } from '../../../utils/constants'
import Pagination from '../../../shared/Pagination'
import ListStructure from './ListStructure'
import RoleSearchBar from './RoleSearchBar'

const RoleListRight = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { search } = useContext(FilterContext)

  const [pageNumber, pageOffset] = useContext(RoleFilterContext)

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

  const { loading, error, data } = useQuery(CANDIDATE_ROLE_PAGINATION_ATTRIBUTES_QUERY, {
    variables: { search }
  })

  return (
    <>
      <RoleSearchBar ref={topRef} />
      <ListStructure
        pageOffset={pageOffset}
        defaultPageSize={DEFAULT_PAGE_SIZE}
      />
      { loading && format('ui.pagination.loadingInfo') }
      { error && format('ui.pagination.loadingInfoError') }
      { data &&
        <Pagination
          pageNumber={pageNumber}
          totalCount={data.paginationAttributeCandidateRole.totalCount}
          defaultPageSize={DEFAULT_PAGE_SIZE}
          pageClickHandler={onClickHandler}
        />
      }
    </>
  )
}

export default RoleListRight
