import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import ConfirmActionDialog from '../../shared/form/ConfirmActionDialog'
import DeleteButton from '../../shared/form/DeleteButton'
import { DELETE_PLAYBOOK } from '../../shared/mutation/playbook'
import { PLAYBOOK_DETAIL_QUERY } from '../../shared/query/playbook'

const DeletePlaybook = ({ playbook }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showFailureMessage, showSuccessMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const { user } = useUser()
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)

  const toggleConfirmDialog = () => {
    setIsConfirmDialogOpen(!isConfirmDialogOpen)
  }

  const [deletePlaybook, { called, reset }] = useMutation(DELETE_PLAYBOOK, {
    refetchQueries: [{
      query: PLAYBOOK_DETAIL_QUERY,
      variables: { slug: playbook.slug, owner: 'public' },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
    }],
    onCompleted: (data) => {
      const { deletePlaybook: response } = data
      if (response?.playbook && response?.errors?.length === 0) {
        showSuccessMessage(
          format('toast.delete.success', { entity: format('ui.playbook.label') }),
          () => router.push('/playbooks')
        )
        setIsConfirmDialogOpen(false)
      } else {
        showFailureMessage(format('toast.delete.failure', { entity: format('ui.playbook.label') }))
        setIsConfirmDialogOpen(false)
        reset()
      }
    },
    onError: () => {
      showFailureMessage(format('toast.delete.failure', { entity: format('ui.playbook.label') }))
      setIsConfirmDialogOpen(false)
      reset()
    }
  })

  const onConfirmDelete = () => {
    if (user) {
      deletePlaybook({
        variables: {
          id: playbook.id
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
