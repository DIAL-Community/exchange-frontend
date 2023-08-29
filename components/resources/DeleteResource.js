import { useIntl } from 'react-intl'
import { useCallback, useContext, useState } from 'react'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import DeleteButton from '../shared/DeleteButton'
import ConfirmActionDialog from '../shared/ConfirmActionDialog'
import { DEFAULT_AUTO_CLOSE_DELAY, ToastContext } from '../../lib/ToastContext'
import { DELETE_RESOURCE } from '../../mutations/resource'
import { RESOURCE_DETAIL_QUERY } from '../../queries/resource'
import { useUser } from '../../lib/hooks'

const DeleteResource = ({ resource }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showToast } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const { user } = useUser()

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)

  const toggleConfirmDialog = () => {
    setIsConfirmDialogOpen(!isConfirmDialogOpen)
  }

  const [deleteResource, { called, reset }] = useMutation(DELETE_RESOURCE, {
    refetchQueries: [{
      query: RESOURCE_DETAIL_QUERY,
      variables: { slug: resource.slug }
    }],
    onCompleted: (data) => {
      const { deleteResource: response } = data
      if (response?.resource && response?.errors?.length === 0) {
        showToast(
          format('toast.resource.delete.success'),
          'success',
          'top-center',
          DEFAULT_AUTO_CLOSE_DELAY,
          null,
          () => router.push(`/${locale}/resources`)
        )
        setIsConfirmDialogOpen(false)
      } else {
        showToast(format('toast.resource.delete.failure'), 'error', 'top-center')
        setIsConfirmDialogOpen(false)
        reset()
      }
    },
    onError: () => {
      showToast(format('toast.resource.delete.failure'), 'error', 'top-center')
      setIsConfirmDialogOpen(false)
      reset()
    }
  })

  const onConfirmDelete = () => {
    if (user) {
      const { userEmail, userToken } = user

      deleteResource({
        variables: {
          id: resource.id
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
        title={format('app.deletingEntity', { entity: resource.name })}
        message={format('ui.resource.delete.confirm.message')}
        isOpen={isConfirmDialogOpen}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
  )
}

export default DeleteResource
