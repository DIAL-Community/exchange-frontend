import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useUser } from '../../lib/hooks'
import { ToastContext } from '../../lib/ToastContext'
import { DELETE_TAG } from '../../mutations/tag'
import ConfirmActionDialog from '../shared/ConfirmActionDialog'
import DeleteButton from '../shared/DeleteButton'

const DeleteTag = ({ tag }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false)

  const { locale } = useRouter()

  const { user } = useUser()

  const { showToast } = useContext(ToastContext)

  const [deleteTag, { called, reset }] = useMutation(DELETE_TAG, {
    refetchQueries: ['SearchTags'],
    onCompleted: () => {
      showToast(format('toast.tag.delete.success'), 'success', 'top-center')
      setDisplayConfirmDialog(false)
    },
    onError: () => {
      showToast(format('toast.tag.delete.failure'), 'error', 'top-center')
      setDisplayConfirmDialog(false)
      reset()
    }
  })

  const onConfirmDelete = () => {
    if (user) {
      const { userEmail, userToken } = user

      deleteTag({
        variables: { id: tag.id },
        context: {
          headers: {
            'Accept-Language': locale,
            Authorization: `${userEmail} ${userToken}`
          }
        }
      })
    }
  }

  const toggleConfirmDeleteDialog = () => {
    setDisplayConfirmDialog(!displayConfirmDialog)
  }

  return (
    <>
      <DeleteButton type='button' onClick={toggleConfirmDeleteDialog} />
      <ConfirmActionDialog
        title={format('app.deleting-entity', { entity: tag.name })}
        message={format('tag.delete.confirm.message')}
        isOpen={displayConfirmDialog}
        onClose={toggleConfirmDeleteDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called}
      />
    </>
  )
}

export default DeleteTag
