import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { ToastContext } from '../../../lib/ToastContext'
import ConfirmActionDialog from '../../shared/form/ConfirmActionDialog'
import DeleteButton from '../../shared/form/DeleteButton'
import { DELETE_RESOURCE_TOPIC } from '../../shared/mutation/resourceTopic'
import { PAGINATED_RESOURCE_TOPICS_QUERY, RESOURCE_TOPIC_DETAIL_QUERY } from '../../shared/query/resourceTopic'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'

const DeleteResourceTopic = ({ resourceTopic }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false)
  const toggleConfirmDialog = () => setDisplayConfirmDialog(!displayConfirmDialog)

  const [deleteResourceTopic, { called, reset }] = useMutation(DELETE_RESOURCE_TOPIC, {
    refetchQueries: [{
      query: RESOURCE_TOPIC_DETAIL_QUERY,
      variables: { slug: resourceTopic.slug },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
    }, {
      query: PAGINATED_RESOURCE_TOPICS_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
    }],
    onCompleted: (data) => {
      const { deleteResourceTopic: response } = data
      if (response?.resourceTopic && response?.errors?.length === 0) {
        setDisplayConfirmDialog(false)
        showSuccessMessage(
          format('toast.delete.success', {
            entity: format('ui.resourceTopic.label.humanized')
          }),
          () => router.push(`/${locale}/resource-topics`)
        )
      } else {
        setDisplayConfirmDialog(false)
        showFailureMessage(format('toast.delete.failure', {
          entity: format('ui.resourceTopic.label').toLowerCase()
        }))
        reset()
      }
    },
    onError: () => {
      setDisplayConfirmDialog(false)
      showFailureMessage(format('toast.delete.failure', {
        entity: format('ui.resourceTopic.label').toLowerCase()
      }))
      reset()
    }
  })

  const onConfirmDelete = () => {
    deleteResourceTopic({
      variables: {
        id: resourceTopic.id
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
        title={format('app.deletingEntity', { entity: resourceTopic.name })}
        message={format('delete.confirm.message', { entity: format('ui.resourceTopic.label').toLowerCase() })}
        isOpen={displayConfirmDialog}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
  )
}

export default DeleteResourceTopic
