import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { PLAYBOOK_PAGINATION_ATTRIBUTES_QUERY } from '../../shared/query/playbook'
import { DPI_TENANT_NAME } from '../constants'
import HubPagination from '../fragments/HubPagination'
import { MESSAGE_PAGE_SIZE } from '../message/constant'

const CurriculumPagination = ({ pageNumber, onClickHandler, theme='light' }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data } = useQuery(PLAYBOOK_PAGINATION_ATTRIBUTES_QUERY, {
    variables: { owner: DPI_TENANT_NAME },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  if (loading) {
    return format('general.fetchingData')
  } else if (error) {
    return format('general.fetchError')
  } else if (!data?.paginationAttributePlaybook) {
    return format('app.notFound')
  }

  const { paginationAttributePlaybook: { totalCount } } = data

  return (
    <HubPagination
      pageNumber={pageNumber}
      totalCount={totalCount}
      defaultPageSize={MESSAGE_PAGE_SIZE}
      onClickHandler={onClickHandler}
      theme={theme}
    />
  )
}

export default CurriculumPagination
