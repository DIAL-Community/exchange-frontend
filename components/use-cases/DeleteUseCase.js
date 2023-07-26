import { useIntl } from 'react-intl'
import { useCallback, useContext, useState } from 'react'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import DeleteButton from '../shared/DeleteButton'
import ConfirmActionDialog from '../shared/ConfirmActionDialog'
import { DEFAULT_AUTO_CLOSE_DELAY, ToastContext } from '../../lib/ToastContext'
import { DELETE_USE_CASE } from '../../mutations/use-case'
import { useUser } from '../../lib/hooks'
import { USE_CASE_DETAIL_QUERY } from '../../queries/use-case'

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
    refetchQueries: [{
      query: USE_CASE_DETAIL_QUERY,
      variables: { slug: useCase.slug }
    }],
    onCompleted: (data) => {
      const { deleteUseCase: response } = data
      if (response?.useCase && response?.errors?.length === 0) {
        setDisplayConfirmDialog(false)
        showToast(
          format('toast.use-case.delete.success'),
          'success',
          'top-center',
          DEFAULT_AUTO_CLOSE_DELAY,
          null,
          () => router.push('/use_cases')
        )
      } else {
        setDisplayConfirmDialog(false)
        showToast(format('toast.use-case.delete.failure'), 'error', 'top-center')
        reset()
      }
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
        title={format('app.deletingEntity', { entity: useCase.name })}
        message={format('use-case.delete.confirm.message')}
        isOpen={displayConfirmDialog}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
  )
}

export default DeleteUseCase
