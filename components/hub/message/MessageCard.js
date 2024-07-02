import { useCallback, useContext, useState } from 'react'
import parse from 'html-react-parser'
import Link from 'next/link'
import { FaRegEye, FaRegEyeSlash, FaSpinner } from 'react-icons/fa6'
import { FormattedDate, useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import { UPDATE_MESSAGE_VISIBILITY } from '../../shared/mutation/message'
import { findMessageTypeLabel } from './constant'

const MessageCard = ({ message }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user } = useUser()

  const [mutating, setMutating] = useState(false)

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

  const displayLargeCard = () =>
    <div className={`py-6 rounded-lg min-h-[12rem]} ${message.visible? 'opacity-100' : 'opacity-10'}`}>
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

  return (
    <div className='relative'>
      <Link href={`/hub/admin/broadcasts/${message.slug}`}>
        {displayLargeCard()}
      </Link>
      <div className='lg:absolute top-0 right-0 cursor-pointer'>
        {(user.isAdminUser || user.isAdliAdminUser) &&
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
        }
      </div>
    </div>
  )
}

export default MessageCard
