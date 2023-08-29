import { useIntl } from 'react-intl'
import { useCallback, useContext, useState } from 'react'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { DEFAULT_PAGE_SIZE } from '../utils/constants'
import { ToastContext } from '../../../lib/ToastContext'
import { useUser } from '../../../lib/hooks'
import { DELETE_WORKFLOW } from '../shared/mutation/workflow'
import { PAGINATED_WORKFLOWS_QUERY, WORKFLOW_DETAIL_QUERY } from '../shared/query/workflow'
import DeleteButton from '../shared/form/DeleteButton'
import ConfirmActionDialog from '../shared/form/ConfirmActionDialog'

const DeleteWorkflow = ({ workflow }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const { user } = useUser()

  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false)
  const toggleConfirmDialog = () => setDisplayConfirmDialog(!displayConfirmDialog)

  const [deleteWorkflow, { called, reset }] = useMutation(DELETE_WORKFLOW, {
    refetchQueries: [{
      query: WORKFLOW_DETAIL_QUERY,
      variables: { slug: workflow.slug }
    }, {
      query: PAGINATED_WORKFLOWS_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 }
    }],
    onCompleted: (data) => {
      const { deleteWorkflow: response } = data
      if (response?.workflow && response?.errors?.length === 0) {
        setDisplayConfirmDialog(false)
        showSuccessMessage(
          format('toast.delete.success', { entity: format('ui.workflow.label') }),
          () => router.push(`/${locale}/workflows`)
        )
      } else {
        setDisplayConfirmDialog(false)
        showFailureMessage(format('toast.delete.failure', { entity: format('ui.workflow.label') }))
        reset()
      }
    },
    onError: () => {
      setDisplayConfirmDialog(false)
      showFailureMessage(format('toast.delete.failure', { entity: format('ui.workflow.label') }))
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
        message={format('delete.confirm.message', { entity: format('ui.workflow.label') })}
        isOpen={displayConfirmDialog}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
  )
}

export default DeleteWorkflow
