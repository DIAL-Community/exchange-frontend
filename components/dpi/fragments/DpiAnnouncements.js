import { useCallback, useState } from 'react'
import parse from 'html-react-parser'
import Link from 'next/link'
import { FormattedDate, useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { PAGINATED_MESSAGES_QUERY } from '../../shared/query/message'
import { DPI_ANNOUNCEMENT_MESSAGE_TYPE, findMessageTypeLabel, MESSAGE_PAGE_SIZE } from '../message/constant'
import MessagePagination from '../message/MessagePagination'
import { stripeClasses } from '../sections/DpiDashboard'

const AnnouncementCard = ({ message }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const displayLargeCard = () =>
    <div className={`py-6 rounded-lg min-h-[12rem]} ${message.visible? 'opacity-100' : 'opacity-10'}`}>
      <div className='flex flex-col lg:flex-row gap-x-6 gap-y-3'>
        <div className='flex flex-col gap-y-3'>
          <div className='text-lg font-semibold'>
            {message.name}
          </div>
          <div className='line-clamp-4'>
            {message.messageTemplate && parse(message.messageTemplate)}
          </div>
          <div className='flex'>
            <div className='text-sm italic'>
              {findMessageTypeLabel(message.messageType, format)}
            </div>
            <div className='ml-auto'>
              <FormattedDate date={message.messageDate} />
            </div>
          </div>
        </div>
      </div>
    </div>

  return (
    <div className='relative'>
      <Link href={`/dpi-dashboard/dpi-announcements/${message.slug}`}>
        {displayLargeCard()}
      </Link>
    </div>
  )
}

const AnnouncementList = ({ pageNumber }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data } = useQuery(PAGINATED_MESSAGES_QUERY, {
    variables: {
      visibleOnly: true,
      messageType: DPI_ANNOUNCEMENT_MESSAGE_TYPE,
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
        <div className='flex flex-col gap-y-4' key={index}>
          <hr className='border-b border-gray-300 border-dashed' />
          <AnnouncementCard key={index} message={message} />
        </div>
      )}
    </div>
  )
}

const DpiAnnouncements = ({ stripeIndex }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [pageNumber, setPageNumber] = useState(0)

  const onClickHandler = useCallback(({ nextSelectedPage, selected }) => {
    const destinationPage = typeof nextSelectedPage  === 'undefined' ? selected : nextSelectedPage
    setPageNumber(destinationPage)
  }, [])

  return (
    <div className={`announcement-section ${stripeClasses(stripeIndex)}`}>
      <div className='px-4 lg:px-8 xl:px-56'>
        <div className='text-2xl py-8 '>
          {format('dpi.announcement.header')}
        </div>
        <AnnouncementList pageNumber={pageNumber} />
        <MessagePagination
          visibleOnly
          messageType={DPI_ANNOUNCEMENT_MESSAGE_TYPE}
          pageNumber={pageNumber}
          onClickHandler={onClickHandler}
          theme={stripeIndex % 2 === 0 ? 'light': 'dark'}
        />
      </div>
    </div>
  )
}

export default DpiAnnouncements
