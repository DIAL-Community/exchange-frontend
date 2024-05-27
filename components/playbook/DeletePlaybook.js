import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { useActiveTenant, useUser } from '../../lib/hooks'
import { DEFAULT_AUTO_CLOSE_DELAY, ToastContext } from '../../lib/ToastContext'
import ConfirmActionDialog from '../shared/form/ConfirmActionDialog'
import DeleteButton from '../shared/form/DeleteButton'
import { DELETE_PLAYBOOK } from '../shared/mutation/playbook'
import { PLAYBOOK_DETAIL_QUERY } from '../shared/query/playbook'

const DeletePlaybook = ({ playbook }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showToast } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const { tenant } = useActiveTenant()

  const { user } = useUser()
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)

  const toggleConfirmDialog = () => {
    setIsConfirmDialogOpen(!isConfirmDialogOpen)
  }

  const [deletePlaybook, { called, reset }] = useMutation(DELETE_PLAYBOOK, {
    refetchQueries: [{
      query: PLAYBOOK_DETAIL_QUERY,
      variables: { slug: playbook.slug, owner: tenant }
    }],
    onCompleted: (data) => {
      const { deletePlaybook: response } = data
      if (response?.playbook && response?.errors?.length === 0) {
        showToast(
          format('toast.playbook.delete.success'),
          'success',
          'top-center',
          DEFAULT_AUTO_CLOSE_DELAY,
          null,
          () => router.push(`/${locale}/playbooks`)
        )
        setIsConfirmDialogOpen(false)
      } else {
        showToast(format('toast.playbook.delete.failure'), 'error', 'top-center')
        setIsConfirmDialogOpen(false)
        reset()
      }
    },
    onError: () => {
      showToast(format('toast.playbook.delete.failure'), 'error', 'top-center')
      setIsConfirmDialogOpen(false)
      reset()
    }
  })

  const onConfirmDelete = () => {
    if (user) {
      const { userEmail, userToken } = user

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
        title={format('app.deletingEntity', { entity: playbook.name })}
        message={format('ui.playbook.delete.confirm.message')}
        isOpen={isConfirmDialogOpen}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
  )
}

export default DeletePlaybook
