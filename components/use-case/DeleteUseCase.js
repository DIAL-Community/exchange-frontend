import { useIntl } from 'react-intl'
import { useCallback, useContext, useState } from 'react'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { DEFAULT_PAGE_SIZE } from '../utils/constants'
import { ToastContext } from '../../lib/ToastContext'
import { useUser } from '../../lib/hooks'
import { DELETE_USE_CASE } from '../shared/mutation/useCase'
import { PAGINATED_USE_CASES_QUERY, USE_CASE_DETAIL_QUERY } from '../shared/query/useCase'
import DeleteButton from '../shared/form/DeleteButton'
import ConfirmActionDialog from '../shared/form/ConfirmActionDialog'

const DeleteUseCase = ({ useCase }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const { user } = useUser()

  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false)
  const toggleConfirmDialog = () => setDisplayConfirmDialog(!displayConfirmDialog)

  const [deleteUseCase, { called, reset }] = useMutation(DELETE_USE_CASE, {
    refetchQueries: [{
      query: USE_CASE_DETAIL_QUERY,
      variables: { slug: useCase.slug }
    }, {
      query: PAGINATED_USE_CASES_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 }
    }],
    onCompleted: (data) => {
      const { deleteUseCase: response } = data
      if (response?.useCase && response?.errors?.length === 0) {
        setDisplayConfirmDialog(false)
        showSuccessMessage(
          format('toast.delete.success', { entity: format('ui.useCase.label') }),
          () => router.push(`/${locale}/use-cases`)
        )
      } else {
        setDisplayConfirmDialog(false)
        showFailureMessage(format('toast.delete.failure', { entity: format('ui.useCase.label') }))
        reset()
      }
    },
    onError: () => {
      setDisplayConfirmDialog(false)
      showFailureMessage(format('toast.delete.failure', { entity: format('ui.useCase.label') }))
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
        message={format('delete.confirm.message', { entity: format('ui.useCase.label') })}
        isOpen={displayConfirmDialog}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
  )
}

export default DeleteUseCase
