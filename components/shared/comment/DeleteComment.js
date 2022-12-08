import { useMutation } from '@apollo/client'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { ToastContext } from '../../../lib/ToastContext'
import { DELETE_COMMENT } from '../../../mutations/comment'
import { COMMENTS_COUNT_QUERY, COMMENTS_QUERY } from '../../../queries/comment'
import ConfirmActionDialog from '../ConfirmActionDialog'
import DeleteButton from '../DeleteButton'

const DeleteComment = ({ commentId }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id) => formatMessage({ id }), [formatMessage])

  const { showToast } = useContext(ToastContext)

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)

  const toggleConfirmDialog = () => setIsConfirmDialogOpen(!isConfirmDialogOpen)

  const [deleteComment, { called, reset }] = useMutation(DELETE_COMMENT, {
    refetchQueries: [{ query: COMMENTS_QUERY }, { query: COMMENTS_COUNT_QUERY }],
    onCompleted: () => {
      showToast(format('toast.comment.delete.success'), 'success', 'top-center')
      toggleConfirmDialog()
      reset()
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
