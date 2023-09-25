import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { WorkflowFilterContext } from '../../../../components/context/WorkflowFilterContext'
import { WORKFLOW_PAGINATION_ATTRIBUTES_QUERY } from '../../shared/query/workflow'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'
import Pagination from '../../shared/Pagination'
import ListStructure from './ListStructure'
import WorkflowSearchBar from './WorkflowSearchBar'

const WorkflowListRight = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { search } = useContext(WorkflowFilterContext)
  const { sdgs, useCases } = useContext(WorkflowFilterContext)

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

  const { loading, error, data } = useQuery(WORKFLOW_PAGINATION_ATTRIBUTES_QUERY, {
    variables: {
      search,
      sdgs: sdgs.map(sdg => sdg.value),
      useCases: useCases.map(sdg => sdg.value)
    }
  })

  return (
    <>
      <WorkflowSearchBar ref={topRef} />
      <ListStructure
        pageOffset={pageOffset}
        defaultPageSize={DEFAULT_PAGE_SIZE}
      />
      { loading && format('ui.pagination.loadingInfo') }
      { error && format('ui.pagination.loadingInfoError') }
      { data &&
        <Pagination
          pageNumber={pageNumber}
          totalCount={data.paginationAttributeWorkflow.totalCount}
          defaultPageSize={DEFAULT_PAGE_SIZE}
          pageClickHandler={handlePageClick}
        />
      }
    </>
  )
}

export default WorkflowListRight
