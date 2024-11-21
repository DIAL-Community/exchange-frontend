import { useCallback, useContext } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import { ADD_BOOKMARK } from '../mutation/bookmark'

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
            'Accept-Language': locale
          }
        }
      })
    }
  }

  return (
    <div className='flex flex-col gap-3 py-3'>
      <div className='text-dial-sapphire font-semibold'>
        {format('ui.bookmark.title')}
      </div>
      <button type='button' onClick={bookmarkThis} className='group flex flex-row gap-x-3'>
        <img
          src='/ui/v1/bookmark-icon.svg'
          alt={format('ui.image.logoAlt', { name: format('ui.bookmark.title') })}
          width={40}
          height={40}
          className='object-contain'
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
