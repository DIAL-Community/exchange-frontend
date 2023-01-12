import { useIntl } from 'react-intl'
import { useCallback, useContext, useState } from 'react'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import DeleteButton from '../shared/DeleteButton'
import ConfirmActionDialog from '../shared/ConfirmActionDialog'
import { DEFAULT_AUTO_CLOSE_DELAY, ToastContext } from '../../lib/ToastContext'
import { DELETE_DATASET } from '../../mutations/dataset'
import { useUser } from '../../lib/hooks'

const DeleteDataset = ({ dataset }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showToast } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const { user } = useUser()

  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false)
  const toggleConfirmDialog = () => setDisplayConfirmDialog(!displayConfirmDialog)

  const [deleteDataset, { called, reset }] = useMutation(DELETE_DATASET, {
    onCompleted: () => {
      setDisplayConfirmDialog(false)
      showToast(
        format('toast.dataset.delete.success'),
        'success',
        'top-center',
        DEFAULT_AUTO_CLOSE_DELAY,
        null,
        () => router.push('/datasets')
      )
    },
    onError: () => {
      setDisplayConfirmDialog(false)
      showToast(format('toast.dataset.delete.failure'), 'error', 'top-center')
      reset()
    }
  })

  const onConfirmDelete = () => {
    if (user) {
      const { userEmail, userToken } = user
      deleteDataset({
        variables: {
          id: dataset.id
        },
        update(cache, { data }) {
          if (data) {
            const identity = {
              id: data.dataset.id,
              __typename: 'Dataset'
            }
            const normalizedId = cache.identify(identity)
            cache.evict({ id: normalizedId })
            cache.gc()
          }
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
        title={format('app.deleting-entity', { entity: dataset.name })}
        message={format('dataset.delete.confirm.message')}
        isOpen={displayConfirmDialog}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
  )
}

export default DeleteDataset
