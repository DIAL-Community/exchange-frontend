import { useMutation } from '@apollo/client'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { ToastContext } from '../../lib/ToastContext'
import { DELETE_TAG } from '../../mutations/tag'
import ConfirmActionDialog from '../shared/ConfirmActionDialog'
import DeleteButton from '../shared/DeleteButton'

const DeleteTag = ({ tag }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false)

  const { locale } = useRouter()

  const [session] = useSession()

  const { showToast } = useContext(ToastContext)

  const [deleteTag, { called, reset }] = useMutation(DELETE_TAG, {
    refetchQueries: ['SearchTags'],
    onCompleted: () => {
      showToast(format('toast.tag.delete.success'), 'success', 'top-center')
      setDisplayConfirmDialog(false)
    },
    onError: () => {
      showToast(format('toast.tag.delete.failure'), 'error', 'top-center')
      setDisplayConfirmDialog(false)
      reset()
    }
  })

  const onConfirmDelete = () => {
    if (session) {
      const { userEmail, userToken } = session.user

      deleteTag({
        variables: { id: tag.id },
        context: {
          headers: {
            'Accept-Language': locale,
            Authorization: `${userEmail} ${userToken}`
          }
        }
      })
    }
  }

  const toggleConfirmDeleteDialog = () => {
    setDisplayConfirmDialog(!displayConfirmDialog)
  }

  return (
    <>
      <DeleteButton type='button' onClick={toggleConfirmDeleteDialog} />
      <ConfirmActionDialog
        title={format('app.deleting-entity', { entity: tag.name })}
        message={format('tag.delete.confirm.message')}
        isOpen={displayConfirmDialog}
        onClose={toggleConfirmDeleteDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called}
      />
    </>
  )
}

export default DeleteTag
