import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { PAGINATED_MESSAGES_QUERY } from '../../shared/query/message'
import { MESSAGE_PAGE_SIZE } from './constant'
import MessageCard from './MessageCard'

const MessageList = ({ pageNumber, search, messageType }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data } = useQuery(PAGINATED_MESSAGES_QUERY, {
    variables: {
      search,
      messageType,
      limit: MESSAGE_PAGE_SIZE,
      offset: pageNumber * MESSAGE_PAGE_SIZE
    }
  })

  if (loading) {
    return format('general.fetchingData')
  } else if (error) {
    return format('general.fetchError')
  } else if (!data?.paginatedMessages) {
    return format('app.notFound')
  }

  const { paginatedMessages: messages } = data

  return (
    <div className='flex flex-col gap-2'>
      {messages.map((message, index) =>
        <div className='flex flex-col gap-y-2' key={index}>
          <hr className='border-b border-gray-300 border-dashed' />
          <MessageCard key={index} message={message} />
        </div>
      )}
    </div>
  )
}

export default MessageList
