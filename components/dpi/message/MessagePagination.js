import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { MESSAGE_PAGINATION_ATTRIBUTES_QUERY } from '../../shared/query/message'
import DpiPagination from '../fragments/DpiPagination'
import { MESSAGE_PAGE_SIZE } from './constant'

const MessagePagination = ({ search, messageType, pageNumber, onClickHandler }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data } = useQuery(MESSAGE_PAGINATION_ATTRIBUTES_QUERY, {
    variables: {
      search,
      messageType
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
    <DpiPagination
      pageNumber={pageNumber}
      totalCount={totalCount}
      defaultPageSize={MESSAGE_PAGE_SIZE}
      onClickHandler={onClickHandler}
      theme='light'
    />
  )
}

export default MessagePagination
