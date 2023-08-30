import { useIntl } from 'react-intl'
import { useCallback, useContext, useState } from 'react'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import DeleteButton from '../shared/DeleteButton'
import ConfirmActionDialog from '../shared/ConfirmActionDialog'
import { DEFAULT_AUTO_CLOSE_DELAY, ToastContext } from '../../lib/ToastContext'
import { DELETE_WORKFLOW } from '../../mutations/workflow'
import { useUser } from '../../lib/hooks'
import { WORKFLOW_DETAIL_QUERY } from '../../queries/workflow'

const DeleteWorkflow = ({ workflow }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showToast } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const { user } = useUser()

  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false)
  const toggleConfirmDialog = () => setDisplayConfirmDialog(!displayConfirmDialog)

  const [deleteWorkflow, { called, reset }] = useMutation(DELETE_WORKFLOW, {
    refetchQueries: [{
      query: WORKFLOW_DETAIL_QUERY,
      variables: { slug: workflow.slug }
    }],
    onCompleted: (data) => {
      const { deleteWorkflow: response } = data
      if (response?.workflow && response?.errors?.length === 0) {
        setDisplayConfirmDialog(false)
        showToast(
          format('toast.workflow.delete.success'),
          'success',
          'top-center',
          DEFAULT_AUTO_CLOSE_DELAY,
          null,
          () => router.push('/workflows')
        )
      } else {
        reset()
        setDisplayConfirmDialog(false)
        showToast(format('toast.workflow.delete.failure'), 'error', 'top-center')
      }
    },
    onError: () => {
      reset()
      setDisplayConfirmDialog(false)
      showToast(format('toast.workflow.delete.failure'), 'error', 'top-center')
    }
  })

  const onConfirmDelete = () => {
    if (user) {
      const { userEmail, userToken } = user
      deleteWorkflow({
        variables: {
          id: workflow.id
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
        title={format('app.deletingEntity', { entity: workflow.name })}
        message={format('workflow.delete.confirm.message')}
        isOpen={displayConfirmDialog}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
  )
}

export default DeleteWorkflow
