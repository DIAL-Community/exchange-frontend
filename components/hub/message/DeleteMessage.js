import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import ConfirmActionDialog from '../../shared/form/ConfirmActionDialog'
import DeleteButton from '../../shared/form/DeleteButton'
import { DELETE_MESSAGE } from '../../shared/mutation/message'
import {
  MESSAGE_DETAIL_QUERY, MESSAGE_PAGINATION_ATTRIBUTES_QUERY, PAGINATED_MESSAGES_QUERY
} from '../../shared/query/message'
import { DPI_TENANT_NAME } from '../constants'
import { DPI_ANNOUNCEMENT_MESSAGE_TYPE, DPI_EVENT_MESSAGE_TYPE, MESSAGE_PAGE_SIZE } from './constant'

const DeleteMessage = ({ message }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const { user } = useUser()
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)

  const toggleConfirmDialog = () => {
    setIsConfirmDialogOpen(!isConfirmDialogOpen)
  }

  const [deleteMessage, { called, reset }] = useMutation(DELETE_MESSAGE, {
    refetchQueries: [{
      query: MESSAGE_DETAIL_QUERY,
      variables: { slug: message.slug, owner: DPI_TENANT_NAME },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
    }, {
      query: PAGINATED_MESSAGES_QUERY,
      variables: { limit: MESSAGE_PAGE_SIZE, offset: 0 },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
    }, {
      query: MESSAGE_PAGINATION_ATTRIBUTES_QUERY,
      variables: { search: '' },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
    }],
    onCompleted: (data) => {
      const { deleteMessage: response } = data
      if (response?.message && response?.errors?.length === 0) {
        showSuccessMessage(
          format('toast.delete.success', {
            entity: response?.message.messageType === DPI_ANNOUNCEMENT_MESSAGE_TYPE
              ? format('hub.broadcast.messageType.announcement')
              : response?.message.messageType === DPI_EVENT_MESSAGE_TYPE
                ? format('hub.broadcast.messageType.event')
                : format('hub.broadcast.messageType.email')
          }),
          () => router.push('/hub/admin/broadcasts')
        )
        setIsConfirmDialogOpen(false)
      } else {
        const [ firstErrorMessage ] = response.errors
        showFailureMessage(firstErrorMessage)
        setIsConfirmDialogOpen(false)
        reset()
      }
    },
    onError: () => {
      showFailureMessage(format('toast.message.delete.failure'))
      setIsConfirmDialogOpen(false)
      reset()
    }
  })

  const onConfirmDelete = () => {
    if (user) {
      deleteMessage({
        variables: {
          id: message.id
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
        title={format('app.deletingEntity', { entity: message.name })}
        message={format('hub.broadcast.delete.confirm.message', {
          messageType: message.messageType === DPI_ANNOUNCEMENT_MESSAGE_TYPE
            ? format('hub.broadcast.messageType.announcement').toLowerCase()
            : message.messageType === DPI_EVENT_MESSAGE_TYPE
              ? format('hub.broadcast.messageType.event').toLowerCase()
              : format('hub.broadcast.messageType.email').toLowerCase()
        })}
        isOpen={isConfirmDialogOpen}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
  )
}

export default DeleteMessage
