import { useCallback, useContext, useRef } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import ListStructure from '../../candidate/product/fragments/ListStructure'
import ProductSearchBar from '../../candidate/product/fragments/ProductSearchBar'
import { FilterContext } from '../../context/FilterContext'
import Pagination from '../../shared/Pagination'
import { CANDIDATE_PRODUCT_PAGINATION_ATTRIBUTES_QUERY } from '../../shared/query/candidateProduct'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'

const SubmissionListRight = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { search, currentUserOnly } = useContext(FilterContext)

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

  const { loading, error, data } = useQuery(CANDIDATE_PRODUCT_PAGINATION_ATTRIBUTES_QUERY, {
    variables: { currentUserOnly, search },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  return (
    <>
      <ProductSearchBar ref={topRef} />
      <ListStructure
        pageOffset={pageOffset}
        defaultPageSize={DEFAULT_PAGE_SIZE}
      />
      {loading && format('ui.pagination.loadingInfo')}
      {error && format('ui.pagination.loadingInfoError')}
      {data &&
        <Pagination
          pageNumber={pageNumber}
          totalCount={data.paginationAttributeCandidateProduct.totalCount}
          defaultPageSize={DEFAULT_PAGE_SIZE}
          onClickHandler={onClickHandler}
        />
      }
    </>
  )
}

export default SubmissionListRight
