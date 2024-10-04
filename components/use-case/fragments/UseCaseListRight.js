import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
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

  const [pageNumber, setPageNumber] = useState(0)
  const [pageOffset, setPageOffset] = useState(0)

  const topRef = useRef(null)
  const { push, query } = useRouter()

  const { page } = query

  useEffect(() => {
    if (page) {
      setPageNumber(parseInt(page) - 1)
      setPageOffset((parseInt(page) - 1) * DEFAULT_PAGE_SIZE)
    }
  }, [page, setPageNumber, setPageOffset])

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
