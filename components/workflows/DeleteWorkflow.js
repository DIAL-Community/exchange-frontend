import { useIntl } from 'react-intl'
import { useCallback, useContext, useState } from 'react'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import DeleteButton from '../shared/DeleteButton'
import ConfirmActionDialog from '../shared/ConfirmActionDialog'
import { DEFAULT_AUTO_CLOSE_DELAY, ToastContext } from '../../lib/ToastContext'
import { DELETE_WORKFLOW } from '../../mutations/workflow'
import { useUser } from '../../lib/hooks'

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
    onCompleted: () => {
      setDisplayConfirmDialog(false)
      showToast(
        format('toast.workflow.delete.success'),
        'success',
        'top-center',
        DEFAULT_AUTO_CLOSE_DELAY,
        null,
        () => router.push('/workflows')
      )
    },
    onError: () => {
      setDisplayConfirmDialog(false)
      showToast(format('toast.workflow.delete.failure'), 'error', 'top-center')
      reset()
    }
  })

  const onConfirmDelete = () => {
    if (user) {
      const { userEmail, userToken } = user
      deleteWorkflow({
        variables: {
          id: workflow.id
        },
        update(cache, { data }) {
          if (data) {
            const identity = {
              id: data.workflow.id,
              __typename: 'Workflow'
            }
            const normalizedId = cache.identify(identity)
            cache.evict({ id: normalizedId })
            cache.gc()
          }
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
        title={format('app.deleting-entity', { entity: workflow.name })}
        message={format('workflow.delete.confirm.message')}
        isOpen={displayConfirmDialog}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
  )
}

export default DeleteWorkflow
