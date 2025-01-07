import { useCallback, useContext, useRef } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { FilterContext } from '../../context/FilterContext'
import Pagination from '../../shared/Pagination'
import { USE_CASE_PAGINATION_ATTRIBUTES_QUERY } from '../../shared/query/useCase'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'
import ListStructure from './ListStructure'
import UseCaseSearchBar from './UseCaseSearchBar'

const UseCaseListRight = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { sdgs, showBeta, showGovStackOnly, search } = useContext(FilterContext)

  const topRef = useRef(null)
  const { push, query } = useRouter()

  const { page } = query
  const pageNumber = page ? parseInt(page) - 1 : 0
  const pageOffset = pageNumber * DEFAULT_PAGE_SIZE

  const onClickHandler = ({ nextSelectedPage, selected }) => {
    const destinationPage = typeof nextSelectedPage === 'undefined' ? selected : nextSelectedPage
    push(
      { query: { ...query, page: destinationPage + 1 } },
      undefined,
      { shallow: true }
    )
    // Scroll to top of the page
    if (topRef && topRef.current) {
      topRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start'
      })
    }
  }

  const { loading, error, data } = useQuery(USE_CASE_PAGINATION_ATTRIBUTES_QUERY, {
    variables: {
      search,
      sdgs: sdgs.map(sdg => sdg.value),
      showBeta,
      showGovStackOnly
    },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  return (
    <>
      <UseCaseSearchBar ref={topRef} />
      <ListStructure
        pageOffset={pageOffset}
        defaultPageSize={DEFAULT_PAGE_SIZE}
      />
      {loading && format('ui.pagination.loadingInfo')}
      {error && format('ui.pagination.loadingInfoError')}
      {data &&
        <Pagination
          pageNumber={pageNumber}
          totalCount={data.paginationAttributeUseCase.totalCount}
          defaultPageSize={DEFAULT_PAGE_SIZE}
          onClickHandler={onClickHandler}
        />
      }
    </>
  )
}

export default UseCaseListRight
