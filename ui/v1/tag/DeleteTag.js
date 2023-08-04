import { useIntl } from 'react-intl'
import { useCallback, useContext, useState } from 'react'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { DEFAULT_PAGE_SIZE, REBRAND_BASE_PATH } from '../utils/constants'
import { ToastContext } from '../../../lib/ToastContext'
import { useUser } from '../../../lib/hooks'
import { DELETE_TAG } from '../shared/mutation/tag'
import { PAGINATED_TAGS_QUERY, TAG_DETAIL_QUERY } from '../shared/query/tag'
import DeleteButton from '../shared/form/DeleteButton'
import ConfirmActionDialog from '../shared/form/ConfirmActionDialog'

const DeleteTag = ({ tag }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showToast } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const { user } = useUser()

  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false)
  const toggleConfirmDialog = () => setDisplayConfirmDialog(!displayConfirmDialog)

  const [deleteTag, { called, reset }] = useMutation(DELETE_TAG, {
    refetchQueries: [{
      query: TAG_DETAIL_QUERY,
      variables: { slug: tag.slug }
    }, {
      query: PAGINATED_TAGS_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 }
    }],
    onCompleted: (data) => {
      const { deleteTag: response } = data
      if (response?.tag && response?.errors?.length === 0) {
        setDisplayConfirmDialog(false)
        showToast(
          format('toast.tag.delete.success'),
          'success',
          'top-center',
          1000,
          null,
          () => router.push(`${REBRAND_BASE_PATH}/tags`)
        )
      } else {
        setDisplayConfirmDialog(false)
        showToast(format('toast.tag.delete.failure'), 'error', 'top-center')
        reset()
      }
    },
    onError: () => {
      setDisplayConfirmDialog(false)
      showToast(format('toast.tag.delete.failure'), 'error', 'top-center')
      reset()
    }
  })

  const onConfirmDelete = () => {
    if (user) {
      const { userEmail, userToken } = user
      deleteTag({
        variables: {
          id: tag.id
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
    <>
      <DeleteButton type='button' onClick={toggleConfirmDialog} />
      <ConfirmActionDialog
        title={format('app.deletingEntity', { entity: tag.name })}
        message={format('tag.delete.confirm.message')}
        isOpen={displayConfirmDialog}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
  )
}

export default DeleteTag
