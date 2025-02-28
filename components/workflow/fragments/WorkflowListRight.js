import { useCallback, useContext, useRef } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { CollectionPageSize, FilterContext } from '../../context/FilterContext'
import Pagination from '../../shared/Pagination'
import { WORKFLOW_PAGINATION_ATTRIBUTES_QUERY } from '../../shared/query/workflow'
import ListStructure from './ListStructure'
import WorkflowSearchBar from './WorkflowSearchBar'

const WorkflowListRight = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { search, collectionDisplayType, sdgs, useCases } = useContext(FilterContext)

  const topRef = useRef(null)
  const { push, query } = useRouter()

  const { 'workflow-page': workflowPage } = query
  const pageNumber = workflowPage ? parseInt(workflowPage) - 1 : 0
  const pageOffset = pageNumber * CollectionPageSize[collectionDisplayType]

  const onClickHandler = ({ nextSelectedPage, selected }) => {
    const destinationPage = typeof nextSelectedPage === 'undefined' ? selected : nextSelectedPage
    push(
      { query: { ...query, 'workflow-page': destinationPage + 1 } },
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

  const { loading, error, data } = useQuery(WORKFLOW_PAGINATION_ATTRIBUTES_QUERY, {
    variables: {
      search,
      sdgs: sdgs.map(sdg => sdg.value),
      useCases: useCases.map(sdg => sdg.value)
    },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  return (
    <>
      <WorkflowSearchBar ref={topRef} />
      <ListStructure
        pageOffset={pageOffset}
        defaultPageSize={CollectionPageSize[collectionDisplayType]}
      />
      {loading && format('ui.pagination.loadingInfo')}
      {error && format('ui.pagination.loadingInfoError')}
      {data &&
        <Pagination
          pageNumber={pageNumber}
          totalCount={data.paginationAttributeWorkflow.totalCount}
          defaultPageSize={CollectionPageSize[collectionDisplayType]}
          onClickHandler={onClickHandler}
        />
      }
    </>
  )
}

export default WorkflowListRight
