import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { ADD_BOOKMARK } from '../mutation/bookmark'
import { useUser } from '../../../../lib/hooks'
import { ToastContext } from '../../../../lib/ToastContext'

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
      <div className='text-lg text-dial-sapphire font-semibold'>
        {format('ui.bookmark.title')}
      </div>
      <button onClick={bookmarkThis} className='group flex flex-row gap-x-3'>
        <img
          src='/ui/v1/bookmark-icon.svg'
          alt={format('ui.image.logoAlt', { name: format('ui.bookmark.title') })}
          width={40}
          height={40}
          className='object-contain'
        />
        <div className='text-sm my-auto border-b border-transparent group-hover:border-dial-slate-500'>
          {format('ui.bookmark.bookmarkThis')}
        </div>
      </button>
      <div className='text-sm text-dial-stratos'>
        {format('ui.bookmark.subtitle')}
      </div>
    </div>
  )
}

export default Bookmark
