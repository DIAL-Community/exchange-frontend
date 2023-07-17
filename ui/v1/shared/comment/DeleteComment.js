import { useMutation } from '@apollo/client'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { COMMENTS_COUNT_QUERY, COMMENTS_QUERY } from '../query/comment'
import { DELETE_COMMENT } from '../mutation/comment'
import { ToastContext } from '../../../../lib/ToastContext'
import DeleteButton from '../form/DeleteButton'
import ConfirmActionDialog from '../form/ConfirmActionDialog'

const DeleteComment = ({ commentId }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id) => formatMessage({ id }), [formatMessage])

  const { showToast } = useContext(ToastContext)

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)

  const toggleConfirmDialog = () => setIsConfirmDialogOpen(!isConfirmDialogOpen)

  const [deleteComment, { called, reset }] = useMutation(DELETE_COMMENT, {
    refetchQueries: [{ query: COMMENTS_QUERY }, { query: COMMENTS_COUNT_QUERY }],
    onCompleted: (data) => {
      const { deleteComment: response } = data
      if (response?.errors?.length === 0) {
        showToast(format('toast.comment.delete.success'), 'success', 'top-center')
        toggleConfirmDialog()
      } else {
        showToast(format('toast.comment.delete.failure'), 'error', 'top-center')
        toggleConfirmDialog()
        reset()
      }
    },
    onError: () => {
      showToast(format('toast.comment.delete.failure'), 'error', 'top-center')
      toggleConfirmDialog()
      reset()
    }
  })

  const onConfirmDelete = () => deleteComment({ variables: { commentId } })

  return (
    <>
      <DeleteButton onClick={toggleConfirmDialog}/>
      <ConfirmActionDialog
        title={format('shared.comment.delete.confirm.header')}
        message={format('shared.comment.delete.confirm.message')}
        isOpen={isConfirmDialogOpen}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called}
      />
    </>
  )
}

export default DeleteComment
