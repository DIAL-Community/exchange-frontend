import { useCallback, useContext, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { UseCaseFilterContext } from '../../../../components/context/UseCaseFilterContext'
import { USE_CASE_PAGINATION_ATTRIBUTES_QUERY } from '../../shared/query/useCase'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'
import Pagination from '../../shared/Pagination'
import ListStructure from './ListStructure'

const UseCaseListRight = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

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

  const { sdgs, showBeta, govStackOnly, search } = useContext(UseCaseFilterContext)
  const { loading, error, data } = useQuery(USE_CASE_PAGINATION_ATTRIBUTES_QUERY, {
    variables: {
      search,
      sdgs: sdgs.map(sdg => sdg.value),
      showBeta,
      govStackOnly
    }
  })

  return (
    <>
      <div className='py-8' ref={topRef}>
        Filtering part
      </div>
      <ListStructure
        pageOffset={pageOffset}
        defaultPageSize={DEFAULT_PAGE_SIZE}
      />
      { loading && format('ui.pagination.loadingInfo') }
      { error && format('ui.pagination.loadingInfoError') }
      { data &&
        <Pagination
          pageNumber={pageNumber}
          totalCount={data.useCasePaginationAttributes.totalCount}
          defaultPageSize={DEFAULT_PAGE_SIZE}
          pageClickHandler={handlePageClick}
        />
      }
    </>
  )
}

export default UseCaseListRight