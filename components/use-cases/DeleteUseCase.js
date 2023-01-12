import { useIntl } from 'react-intl'
import { useCallback, useContext, useState } from 'react'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import DeleteButton from '../shared/DeleteButton'
import ConfirmActionDialog from '../shared/ConfirmActionDialog'
import { DEFAULT_AUTO_CLOSE_DELAY, ToastContext } from '../../lib/ToastContext'
import { DELETE_USE_CASE } from '../../mutations/use-case'
import { useUser } from '../../lib/hooks'

const DeleteUseCase = ({ useCase }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showToast } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const { user } = useUser()

  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false)
  const toggleConfirmDialog = () => setDisplayConfirmDialog(!displayConfirmDialog)

  const [deleteUseCase, { called, reset }] = useMutation(DELETE_USE_CASE, {
    onCompleted: () => {
      setDisplayConfirmDialog(false)
      showToast(
        format('toast.use-case.delete.success'),
        'success',
        'top-center',
        DEFAULT_AUTO_CLOSE_DELAY,
        null,
        () => router.push('/use_cases')
      )
    },
    onError: () => {
      setDisplayConfirmDialog(false)
      showToast(format('toast.use-case.delete.failure'), 'error', 'top-center')
      reset()
    }
  })

  const onConfirmDelete = () => {
    if (user) {
      const { userEmail, userToken } = user
      deleteUseCase({
        variables: {
          id: useCase.id
        },
        update(cache, { data }) {
          if (data) {
            const identity = {
              id: data.useCase.id,
              __typename: 'UseCase'
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
        title={format('app.deleting-entity', { entity: useCase.name })}
        message={format('use-case.delete.confirm.message')}
        isOpen={displayConfirmDialog}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
  )
}

export default DeleteUseCase
