import { useCallback, useContext, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FaRegEye, FaRegEyeSlash, FaSpinner } from 'react-icons/fa6'
import { FiEdit3 } from 'react-icons/fi'
import { useIntl } from 'react-intl'
import { useMutation, useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import { HtmlViewer } from '../../shared/form/HtmlViewer'
import { UPDATE_MESSAGE_VISIBILITY } from '../../shared/mutation/message'
import {
  MESSAGE_DETAIL_QUERY, MESSAGE_PAGINATION_ATTRIBUTES_QUERY, PAGINATED_MESSAGES_QUERY
} from '../../shared/query/message'
import { DPI_ANNOUNCEMENT_MESSAGE_TYPE, DPI_EVENT_MESSAGE_TYPE, MESSAGE_PAGE_SIZE } from '../message/constant'
import HubBreadcrumb from './HubBreadcrumb'

const EventDetail = ({ event }) => {
  const { formatMessage, formatDate, formatTime } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user } = useUser()
  const [mutating, setMutating] = useState(false)

  const router = useRouter()

  const editPath = `/hub/admin/broadcasts/${event.slug}/edit`

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)
  const [ updateMessageVisibility, { reset }] = useMutation(UPDATE_MESSAGE_VISIBILITY, {
    variables: { slug: event.slug, visibility: !event.visible },
    context: { headers: { 'Accept-Language': router.locale } },
    refetchQueries: [{
      query: PAGINATED_MESSAGES_QUERY,
      variables: {
        visibleOnly: true,
        messageType: DPI_EVENT_MESSAGE_TYPE,
        limit: MESSAGE_PAGE_SIZE,
        offset: 0
      }
    }, {
      query: MESSAGE_PAGINATION_ATTRIBUTES_QUERY,
      variables: {
        visibleOnly: true,
        messageType: DPI_EVENT_MESSAGE_TYPE
      }
    }],
    onError: (error) => {
      showFailureMessage(error?.message)
      setMutating(false)
      reset()
    },
    onCompleted: (data) => {
      setMutating(false)
      const { updateMessageVisibility: response } = data
      if (response.errors.length === 0 && response.message) {
        setMutating(false)
        showSuccessMessage(format('hub.broadcast.visibility.updated'))
      } else {
        const [ firstErrorMessage ] = response.errors
        showFailureMessage(firstErrorMessage)
        setMutating(false)
        reset()
      }
    }
  })

  const toggleMessageVisibility = () => {
    setMutating(true)
    updateMessageVisibility()
  }

  const slugNameMapping = (() => {
    const map = {}
    map[event.slug] = event.name

    return map
  })()

  return (
    <div className='relative flex flex-col gap-y-3'>
      {(user.isAdliAdminUser || user.isAdminUser) && (
        <div className='absolute -top-1 -right-1'>
          <div className='flex gap-2'>
            <Link
              href={editPath}
              className='cursor-pointer bg-dial-iris-blue px-4 py-2 rounded text-dial-cotton'
            >
              <FiEdit3 className='inline pb-0.5' />
              <span className='text-sm px-1'>
                {format('app.edit')}
              </span>
            </Link>
            <button
              onClick={toggleMessageVisibility}
              className='flex gap-2 items-center bg-dial-iris-blue px-4 py-2 rounded text-dial-cotton'
            >
              {mutating && <FaSpinner className='spinner ml-3 inline' />}
              {event.visible &&
                <>
                  <FaRegEyeSlash size='1rem' />
                  <span className='text-sm'>
                    {format('app.hide')}
                  </span>
                </>
              }
              {!event.visible &&
                <>
                  <FaRegEye size='1rem' />
                  <span className='text-sm'>
                    {format('app.show')}
                  </span>
                </>
              }
            </button>
          </div>
        </div>
      )}
      <HubBreadcrumb slugNameMapping={slugNameMapping} />
      <div className='text-2xl font-semibold'>
        {event.name}
      </div>
      <hr className='border-b border-dashed border-dial-blue-chalk my-3' />
      <div className='text-sm'>
        <HtmlViewer initialContent={event.parsedMessage} />
      </div>
      <hr className='border-b border-dashed border-dial-blue-chalk my-3' />
      <div className='flex flex-col gap-3 text-sm italic'>
        <div className='flex gap-2'>
          {format('hub.broadcast.messageDatetime.note', {
            type: event.messageType === DPI_ANNOUNCEMENT_MESSAGE_TYPE
              ? format('hub.broadcast.messageType.announcement').toLowerCase()
              : format('hub.broadcast.messageType.event').toLowerCase(),
            dateValue: `${formatDate(event.messageDatetime)} ${formatTime(event.messageDatetime)}`
          })}
        </div>
      </div>
    </div>
  )
}

const HubEventDetail = ({ slug }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, data, error } = useQuery(MESSAGE_DETAIL_QUERY, {
    variables: { slug },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  return (
    <div className='px-4 lg:px-8 xl:px-56 min-h-[80vh] py-8'>
      {loading
        ? format('general.fetchingData')
        : error
          ? format('general.fetchError')
          : slug && data.message
            ? <EventDetail event={data?.message} />
            : format('app.notFound')
      }
    </div>
  )
}

export default HubEventDetail
