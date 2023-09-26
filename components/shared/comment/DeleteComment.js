import { useMutation } from '@apollo/client'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { COMMENTS_COUNT_QUERY, COMMENTS_QUERY } from '../query/comment'
import { DELETE_COMMENT } from '../mutation/comment'
import { ToastContext } from '../../../lib/ToastContext'
import DeleteButton from '../form/DeleteButton'
import ConfirmActionDialog from '../form/ConfirmActionDialog'

const DeleteComment = ({ commentId }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)

  const toggleConfirmDialog = () => setIsConfirmDialogOpen(!isConfirmDialogOpen)

  const [deleteComment, { called, reset }] = useMutation(DELETE_COMMENT, {
    refetchQueries: [{ query: COMMENTS_QUERY }, { query: COMMENTS_COUNT_QUERY }],
    onCompleted: (data) => {
      const { deleteComment: response } = data
      if (response?.errors?.length === 0) {
        showSuccessMessage(format('toast.delete.success', { entity: format('ui.comment.label') }))
        toggleConfirmDialog()
      } else {
        showFailureMessage(format('toast.delete.failure', { entity: format('ui.comment.label') }))
        toggleConfirmDialog()
        reset()
      }
    },
    onError: () => {
      showFailureMessage(format('toast.delete.failure', { entity: format('ui.comment.label') }))
      toggleConfirmDialog()
      reset()
    }
  })

  const onConfirmDelete = () => deleteComment({ variables: { commentId } })

  return (
    <>
      <DeleteButton onClick={toggleConfirmDialog}/>
      <ConfirmActionDialog
        title={format('app.deletingEntity', { entity: format('ui.comment.label') })}
        message={format('delete.confirm.message', { entity: format('ui.comment.label') })}
        isOpen={isConfirmDialogOpen}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called}
      />
    </>
  )
}

export default DeleteComment
