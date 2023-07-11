import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { ADD_BOOKMARK } from '../mutation/bookmark'
import { useUser } from '../../../../lib/hooks'
import { ToastContext } from '../../../../lib/ToastContext'

const Bookmark = ({ object, objectType }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()
  const { locale } = router

  const { user } = useUser()
  const { showToast } = useContext(ToastContext)

  const [addBookmark, { reset }] = useMutation(ADD_BOOKMARK, {
    onCompleted: (data) => {
      const { addBookmark: response } = data
      if (response?.bookmark && response?.errors?.length === 0) {
        showToast(format('toast.addBookmark.success'), 'success', 'top-center')
      } else {
        showToast(format('toast.addBookmark.failure'), 'error', 'top-center')
        reset()
      }
    },
    onError: () => {
      showToast(format('toast.addBookmark.failure'), 'error', 'top-center')
      reset()
    }
  })

  const bookmarkThis = () => {
    if (user && object && objectType) {
      const { userEmail, userToken } = user
      addBookmark({
        variables: {
          data: object.id,
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
      <div className='text-lg text-dial-sapphire font-semibold'>
        {format('ui.bookmark.title')}
      </div>
      <div className='flex flex-row gap-x-3'>
        <img
          src='/ui/v1/bookmark-icon.svg'
          alt={format('ui.image.logoAlt', { name: format('ui.bookmark.title') })}
          width={40}
          height={40}
          className='object-contain'
        />
        <button onClick={bookmarkThis}>
          <div className='text-sm my-auto border-b border-transparent hover:border-dial-slate-500'>
            {format('ui.bookmark.bookmarkThis')}
          </div>
        </button>
      </div>
      <div className='text-sm text-dial-stratos'>
        {format('ui.bookmark.subtitle')}
      </div>
    </div>
  )
}

export default Bookmark
