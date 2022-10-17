import { useIntl } from 'react-intl'
import { useSession } from 'next-auth/react'
import { useCallback, useContext, useState } from 'react'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import DeleteButton from '../shared/DeleteButton'
import ConfirmActionDialog from '../shared/ConfirmActionDialog'
import { ToastContext } from '../../lib/ToastContext'
import { DELETE_PLAYBOOK } from '../../mutations/playbook'

const DeletePlaybook = ({ playbook }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showToast } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const { data: session } = useSession()
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)

  const toggleConfirmDialog = () => {
    setIsConfirmDialogOpen(!isConfirmDialogOpen)
  }

  const [deletePlaybook, { called, reset }] = useMutation(DELETE_PLAYBOOK, {
    onCompleted: () => {
      showToast(
        format('toast.playbook.delete.success'),
        'success',
        'top-center',
        null,
        () => router.push(`/${locale}/playbooks`)
      )
      setIsConfirmDialogOpen(false)
    },
    onError: () => {
      showToast(format('toast.playbook.delete.failure'), 'error', 'top-center')
      setIsConfirmDialogOpen(false)
      reset()
    }
  })

  const onConfirmDelete = () => {
    if (session) {
      const { userEmail, userToken } = session.user

      deletePlaybook({
        variables: {
          id: playbook.id
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
      <DeleteButton type='button' onClick={toggleConfirmDialog}/>
      <ConfirmActionDialog
        title={format('app.deleting-entity', { entity: playbook.name })}
        message={format('playbook.delete.confirm.message')}
        isOpen={isConfirmDialogOpen}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
  )
}

export default DeletePlaybook
