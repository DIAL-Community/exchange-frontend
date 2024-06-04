import { useCallback, useContext, useState } from 'react'
import Link from 'next/link'
import { FaRegEye, FaRegEyeSlash, FaSpinner } from 'react-icons/fa6'
import { FiEdit3 } from 'react-icons/fi'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import { HtmlViewer } from '../../shared/form/HtmlViewer'
import { UPDATE_MESSAGE_VISIBILITY } from '../../shared/mutation/message'
import { DPI_ANNOUNCEMENT_MESSAGE_TYPE, findMessageTypeLabel } from './constant'

const MessageDetail = ({ message }) => {
  const { formatMessage, formatDate, formatTime } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user } = useUser()
  const [mutating, setMutating] = useState(false)

  const editPath = `${message.slug}/edit`

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)
  const [ updateMessageVisibility, { reset }] = useMutation(UPDATE_MESSAGE_VISIBILITY, {
    variables: { slug: message.slug, visibility: !message.visible },
    context: { headers: { 'Accept-Language': message.locale } },
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
        showSuccessMessage(format('dpi.broadcast.visibility.updated'))
      } else {
        showFailureMessage(response.errors)
        setMutating(false)
        reset()
      }
    }
  })

  const toggleMessageVisibility = () => {
    setMutating(true)
    updateMessageVisibility()
  }

  return (
    <div className='relative flex flex-col gap-y-3 text-dial-cotton'>
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
              {message.visible &&
                <>
                  <FaRegEyeSlash size='1rem' />
                  <span className='text-sm'>
                    {format('app.hide')}
                  </span>
                </>
              }
              {!message.visible &&
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
      <div className='text-2xl font-semibold'>
        {message.name}
      </div>
      <hr className='border-b border-dashed border-dial-blue-chalk my-3' />
      <div className='text-xl font-semibold'>
        {format('dpi.broadcast.messageType')}
      </div>
      <div className='block'>
        {findMessageTypeLabel(message.messageType, format)}
      </div>
      <hr className='border-b border-dashed border-dial-blue-chalk my-3' />
      <div className='flex flex-col gap-y-3'>
        <div className='text-xl font-semibold'>
          {format('dpi.broadcast.messageTemplate')}
        </div>
        <div className='text-sm'>
          <HtmlViewer initialContent={message.messageTemplate} />
        </div>
      </div>
      <hr className='border-b border-dashed border-dial-blue-chalk my-3' />
      <div className='flex flex-col gap-y-3'>
        <div className='text-xl font-semibold'>
          {format('dpi.broadcast.parsedMessage')}
        </div>
        <div className='text-sm'>
          <HtmlViewer initialContent={message.parsedMessage} />
        </div>
      </div>
      <hr className='border-b border-dashed border-dial-blue-chalk my-3' />
      <div className='flex flex-col gap-3 text-sm italic'>
        <div className='flex gap-2'>
          {format('dpi.broadcast.messageDatetime.note', {
            type: message.messageType === DPI_ANNOUNCEMENT_MESSAGE_TYPE
              ? format('dpi.broadcast.messageType.announcement').toLowerCase()
              : format('dpi.broadcast.messageType.event').toLowerCase(),
            dateValue: `${formatDate(message.messageDatetime)} ${formatTime(message.messageDatetime)}`
          })}
        </div>
        <div className={message.visible? 'text-green-500' : 'text-red-500'}>
          {message.visible
            ? format('dpi.broadcast.visible', {
              message_type: message.messageType === DPI_ANNOUNCEMENT_MESSAGE_TYPE
                ? format('dpi.broadcast.messageType.announcement')
                : format('dpi.broadcast.messageType.event')
            })
            : format('dpi.broadcast.hidden', {
              message_type: message.messageType === DPI_ANNOUNCEMENT_MESSAGE_TYPE
                ? format('dpi.broadcast.messageType.announcement')
                : format('dpi.broadcast.messageType.event')
            })
          }
        </div>
      </div>
    </div>
  )
}

export default MessageDetail
