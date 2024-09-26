import { useCallback, useContext, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FaRegEye, FaRegEyeSlash, FaSpinner } from 'react-icons/fa6'
import { FiEdit3 } from 'react-icons/fi'
import { useIntl } from 'react-intl'
import { useMutation, useQuery } from '@apollo/client'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import { HtmlViewer } from '../../shared/form/HtmlViewer'
import { UPDATE_MESSAGE_VISIBILITY } from '../../shared/mutation/message'
import {
  MESSAGE_DETAIL_QUERY, MESSAGE_PAGINATION_ATTRIBUTES_QUERY, PAGINATED_MESSAGES_QUERY
} from '../../shared/query/message'
import { DPI_ANNOUNCEMENT_MESSAGE_TYPE, MESSAGE_PAGE_SIZE } from '../message/constant'
import HubBreadcrumb from './HubBreadcrumb'

const AnnouncementDetail = ({ announcement }) => {
  const { formatMessage, formatDate, formatTime } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user } = useUser()
  const [mutating, setMutating] = useState(false)

  const router = useRouter()

  const editPath = `/hub/admin/broadcasts/${announcement.slug}/edit`

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)
  const [ updateMessageVisibility, { reset }] = useMutation(UPDATE_MESSAGE_VISIBILITY, {
    variables: { slug: announcement.slug, visibility: !announcement.visible },
    context: { headers: { 'Accept-Language': router.locale } },
    refetchQueries: [{
      query: PAGINATED_MESSAGES_QUERY,
      variables: {
        visibleOnly: true,
        messageType: DPI_ANNOUNCEMENT_MESSAGE_TYPE,
        limit: MESSAGE_PAGE_SIZE,
        offset: 0
      }
    }, {
      query: MESSAGE_PAGINATION_ATTRIBUTES_QUERY,
      variables: {
        visibleOnly: true,
        messageType: DPI_ANNOUNCEMENT_MESSAGE_TYPE
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
        const [ initialErrorMessage ] = response.errors
        showFailureMessage(initialErrorMessage)
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
    map[announcement.slug] = announcement.name

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
              {announcement.visible &&
                <>
                  <FaRegEyeSlash size='1rem' />
                  <span className='text-sm'>
                    {format('app.hide')}
                  </span>
                </>
              }
              {!announcement.visible &&
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
        {announcement.name}
      </div>
      <hr className='border-b border-dashed border-dial-blue-chalk my-3' />
      <div className='text-sm'>
        <HtmlViewer initialContent={announcement.parsedMessage} />
      </div>
      <hr className='border-b border-dashed border-dial-blue-chalk my-3' />
      <div className='flex flex-col gap-3 text-sm italic'>
        <div className='flex gap-2'>
          {format('hub.broadcast.messageDatetime.note', {
            type: announcement.messageType === DPI_ANNOUNCEMENT_MESSAGE_TYPE
              ? format('hub.broadcast.messageType.announcement').toLowerCase()
              : format('hub.broadcast.messageType.announcement').toLowerCase(),
            dateValue: `${formatDate(announcement.messageDatetime)} ${formatTime(announcement.messageDatetime)}`
          })}
        </div>
      </div>
    </div>
  )
}

const HubAnnouncementDetail = ({ slug }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, data, error } = useQuery(MESSAGE_DETAIL_QUERY, {
    variables: { slug }
  })

  return (
    <div className='px-4 lg:px-8 xl:px-56 min-h-[80vh] py-8'>
      {loading
        ? format('general.fetchingData')
        : error
          ? format('general.fetchError')
          : slug && data.message
            ? <AnnouncementDetail announcement={data?.message} />
            : format('app.notFound')
      }
    </div>
  )
}

export default HubAnnouncementDetail
