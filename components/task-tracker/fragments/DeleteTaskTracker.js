import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { ToastContext } from '../../../lib/ToastContext'
import ConfirmActionDialog from '../../shared/form/ConfirmActionDialog'
import DeleteButton from '../../shared/form/DeleteButton'
import { DELETE_TASK_TRACKER } from '../../shared/mutation/taskTracker'
import { PAGINATED_TASK_TRACKERS_QUERY, TASK_TRACKER_DETAIL_QUERY } from '../../shared/query/taskTracker'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'

const DeleteTaskTracker = ({ taskTracker }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false)
  const toggleConfirmDialog = () => setDisplayConfirmDialog(!displayConfirmDialog)

  const [deleteTaskTracker, { called, reset }] = useMutation(DELETE_TASK_TRACKER, {
    refetchQueries: [{
      query: TASK_TRACKER_DETAIL_QUERY,
      variables: { slug: taskTracker.slug },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
    }, {
      query: PAGINATED_TASK_TRACKERS_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
    }],
    onCompleted: (data) => {
      const { deleteTaskTracker: response } = data
      if (response?.taskTracker && response?.errors?.length === 0) {
        setDisplayConfirmDialog(false)
        showSuccessMessage(
          format('toast.delete.success', { entity: format('ui.taskTracker.label') }),
          () => router.push(`/${locale}/task-trackers`)
        )
      } else {
        setDisplayConfirmDialog(false)
        showFailureMessage(format('toast.delete.failure', { entity: format('ui.taskTracker.label') }))
        reset()
      }
    },
    onError: () => {
      setDisplayConfirmDialog(false)
      showFailureMessage(format('toast.delete.failure', { entity: format('ui.taskTracker.label') }))
      reset()
    }
  })

  const onConfirmDelete = () => {
    deleteTaskTracker({
      variables: {
        id: taskTracker.id
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
        title={format('app.deletingEntity', { entity: taskTracker.name })}
        message={format('delete.confirm.message', { entity: format('ui.taskTracker.label') })}
        isOpen={displayConfirmDialog}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
  )
}

export default DeleteTaskTracker
