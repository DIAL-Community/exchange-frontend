import { useCallback, useState } from 'react'
import parse from 'html-react-parser'
import Link from 'next/link'
import { FormattedDate, useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { PAGINATED_MESSAGES_QUERY } from '../../shared/query/message'
import { DPI_EVENT_MESSAGE_TYPE, findMessageTypeLabel, MESSAGE_PAGE_SIZE } from '../message/constant'
import MessagePagination from '../message/MessagePagination'
import { stripeClasses } from '../sections/HubDashboard'

const EventCard = ({ message }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const displayLargeCard = () =>
    <div className='rounded-lg min-h-[12rem]'>
      <div className='flex flex-col gap-y-3'>
        <div className='text-lg font-semibold'>
          {message.name}
        </div>
        <div className='line-clamp-4 text-justify'>
          {message.messageTemplate && parse(message.parsedMessage)}
        </div>
        <div className='flex'>
          <div className='text-sm italic grow'>
            {findMessageTypeLabel(message.messageType, format)}
          </div>
          <div className='ml-auto'>
            <FormattedDate date={message.messageDate} />
          </div>
        </div>
      </div>
    </div>

  return (
    <div className='relative'>
      <Link href={`/hub/dashboard/events/${message.slug}`}>
        {displayLargeCard()}
      </Link>
    </div>
  )
}

const EventList = ({ pageNumber }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data } = useQuery(PAGINATED_MESSAGES_QUERY, {
    variables: {
      visibleOnly: true,
      messageType: DPI_EVENT_MESSAGE_TYPE,
      limit: MESSAGE_PAGE_SIZE,
      offset: pageNumber * MESSAGE_PAGE_SIZE
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
  } else if (!data?.paginatedMessages) {
    return format('app.notFound')
  }

  const { paginatedMessages: messages } = data

  return (
    <div className='flex flex-col gap-2'>
      {messages.map((message, index) =>
        <div className='flex flex-col gap-y-4' key={index}>
          <hr className='border-b border-gray-300 border-dashed' />
          <EventCard key={index} message={message} />
        </div>
      )}
    </div>
  )
}

const HubEvents = ({ stripeIndex }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [pageNumber, setPageNumber] = useState(0)

  const onClickHandler = useCallback(({ nextSelectedPage, selected }) => {
    const destinationPage = typeof nextSelectedPage  === 'undefined' ? selected : nextSelectedPage
    setPageNumber(destinationPage)
  }, [])

  return (
    <div className={`event-section ${stripeClasses(stripeIndex)}`}>
      <div className='px-4 lg:px-8 xl:px-24 3xl:px-56'>
        <div className='text-2xl py-6'>
          {format('hub.event.header')}
        </div>
        <EventList pageNumber={pageNumber} />
        <MessagePagination
          visibleOnly
          messageType={DPI_EVENT_MESSAGE_TYPE}
          pageNumber={pageNumber}
          onClickHandler={onClickHandler}
          theme={stripeIndex % 2 === 0 ? 'dark': 'light'}
        />
      </div>
    </div>
  )
}

export default HubEvents
