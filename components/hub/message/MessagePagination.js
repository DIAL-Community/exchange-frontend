import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { MESSAGE_PAGINATION_ATTRIBUTES_QUERY } from '../../shared/query/message'
import HubPagination from '../fragments/HubPagination'
import { MESSAGE_PAGE_SIZE } from './constant'

const MessagePagination = ({ search, visibleOnly, messageType, pageNumber, onClickHandler, theme='light' }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data } = useQuery(MESSAGE_PAGINATION_ATTRIBUTES_QUERY, {
    variables: {
      search,
      visibleOnly,
      messageType
    },
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
  } else if (!data?.paginationAttributeMessage) {
    return format('app.notFound')
  }

  const { paginationAttributeMessage: { totalCount } } = data

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

export default MessagePagination
