import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { ToastContext } from '../../../lib/ToastContext'
import ConfirmActionDialog from '../../shared/form/ConfirmActionDialog'
import DeleteButton from '../../shared/form/DeleteButton'
import { DELETE_WORKFLOW } from '../../shared/mutation/workflow'
import { PAGINATED_WORKFLOWS_QUERY, WORKFLOW_DETAIL_QUERY } from '../../shared/query/workflow'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'

const DeleteWorkflow = ({ workflow }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false)
  const toggleConfirmDialog = () => setDisplayConfirmDialog(!displayConfirmDialog)

  const [deleteWorkflow, { called, reset }] = useMutation(DELETE_WORKFLOW, {
    refetchQueries: [{
      query: WORKFLOW_DETAIL_QUERY,
      variables: { slug: workflow.slug },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
    }, {
      query: PAGINATED_WORKFLOWS_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
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
    deleteWorkflow({
      variables: {
        id: workflow.id
      },
      context: {
        headers: {
          'Accept-Language': locale
        }
      }
    })
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
