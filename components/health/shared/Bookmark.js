import { useCallback, useContext } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { FaRegBookmark } from 'react-icons/fa6'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import { ADD_BOOKMARK } from '../../../components/shared/mutation/bookmark'

const Bookmark = ({ object, sharableLink, objectType }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user } = useUser()
  const { locale, pathname } = useRouter()
  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const [addBookmark, { reset }] = useMutation(ADD_BOOKMARK, {
    onCompleted: (data) => {
      const { addBookmark: response } = data
      if (response?.bookmark && response?.errors?.length === 0) {
        showSuccessMessage(format('toast.addBookmark.success'))
      } else {
        showFailureMessage(format('toast.addBookmark.failure'))
        reset()
      }
    },
    onError: () => {
      showFailureMessage(format('toast.addBookmark.failure'))
      reset()
    }
  })

  const bookmarkThis = () => {
    if (user && objectType) {
      const { userEmail, userToken } = user
      addBookmark({
        variables: {
          data: object?.id
            ? object.id
            : sharableLink
              ? sharableLink()
              : pathname,
          type: objectType
        },
        context: {
          headers: {
            'Accept-Language': locale,
            Authorization: `${userEmail} ${userToken}`
          }
        }
      })
    }
  }

  return (
    <div className='flex flex-col gap-3 py-3'>
      <div className='text-black font-semibold'>
        {format('ui.bookmark.title')}
      </div>
      <button type='button' onClick={bookmarkThis} className='group flex flex-row gap-x-3'>
        <FaRegBookmark
          className='w-10 h-10 bg-health-red fill-white rounded-full rotate-45'
          viewBox="-200 -200 800 900"
        />
        <div className='my-auto border-b border-transparent group-hover:border-dial-slate-500'>
          <div className='text-sm text-dial-stratos text-left'>
            {format('ui.bookmark.bookmarkThis')}
          </div>
        </div>
      </button>
      <div className='text-sm text-dial-stratos'>
        {format('ui.bookmark.subtitle')}
      </div>
    </div>
  )
}

export default Bookmark
