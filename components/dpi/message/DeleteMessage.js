import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import ConfirmActionDialog from '../../shared/form/ConfirmActionDialog'
import DeleteButton from '../../shared/form/DeleteButton'
import { DELETE_MESSAGE } from '../../shared/mutation/message'
import { PAGINATED_MESSAGES_QUERY } from '../../shared/query/message'
import { MESSAGE_DETAIL_QUERY } from '../../shared/query/play'
import { DPI_ANNOUNCEMENT_MESSAGE_TYPE, DPI_EVENT_MESSAGE_TYPE } from './constant'

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
      variables: { slug: message.slug, owner: 'dpi' }
    }, {
      query: PAGINATED_MESSAGES_QUERY,
      variables: { }
    }],
    onCompleted: (data) => {
      const { deleteMessage: response } = data
      if (response?.message && response?.errors?.length === 0) {
        showSuccessMessage(
          format('toast.delete.success', {
            entity: response?.message.messageType === DPI_ANNOUNCEMENT_MESSAGE_TYPE
              ? format('dpi.broadcast.messageType.announcement')
              : response?.message.messageType === DPI_EVENT_MESSAGE_TYPE
                ? format('dpi.broadcast.messageType.event')
                : format('dpi.broadcast.messageType.email')
          }),
          () => router.push('/dpi-admin/broadcasts')
        )
        setIsConfirmDialogOpen(false)
      } else {
        showFailureMessage(response.errors)
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
      const { userEmail, userToken } = user

      deleteMessage({
        variables: {
          id: message.id
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
        title={format('app.deletingEntity', { entity: message.name })}
        message={format('dpi.broadcast.delete.confirm.message', {
          messageType: message.messageType === DPI_ANNOUNCEMENT_MESSAGE_TYPE
            ? format('dpi.broadcast.messageType.announcement').toLowerCase()
            : message.messageType === DPI_EVENT_MESSAGE_TYPE
              ? format('dpi.broadcast.messageType.event').toLowerCase()
              : format('dpi.broadcast.messageType.email').toLowerCase()
        })}
        isOpen={isConfirmDialogOpen}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
  )
}

export default DeleteMessage
