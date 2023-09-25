import { useIntl } from 'react-intl'
import { useCallback, useContext, useState } from 'react'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { ToastContext } from '../../lib/ToastContext'
import { useUser } from '../../lib/hooks'
import { DELETE_CATEGORY_INDICATOR } from '../shared/mutation/categoryIndicator'
import { CATEGORY_INDICATOR_SEARCH_QUERY } from '../shared/query/categoryIndicator'
import DeleteButton from '../shared/form/DeleteButton'
import ConfirmActionDialog from '../shared/form/ConfirmActionDialog'

const DeleteCategoryIndicator = ({ categoryIndicator }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const { user } = useUser()

  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false)
  const toggleConfirmDialog = () => setDisplayConfirmDialog(!displayConfirmDialog)

  const [deleteCategoryIndicator, { called, reset }] = useMutation(DELETE_CATEGORY_INDICATOR, {
    refetchQueries: [{
      query: CATEGORY_INDICATOR_SEARCH_QUERY,
      variables: { search: '' }
    }],
    onCompleted: (data) => {
      const { deleteCategoryIndicator: response } = data
      if (response?.categoryIndicator && response?.errors?.length === 0) {
        setDisplayConfirmDialog(false)
        showSuccessMessage(
          format('toast.delete.success', { entity: format('categoryIndicator.label') }),
          () => router.push(`/${locale}/categoryIndicators`)
        )
      } else {
        setDisplayConfirmDialog(false)
        showFailureMessage(format('toast.delete.failure', { entity: format('categoryIndicator.label') }))
        reset()
      }
    },
    onError: () => {
      setDisplayConfirmDialog(false)
      showFailureMessage(format('toast.delete.failure', { entity: format('categoryIndicator.label') }))
      reset()
    }
  })

  const onConfirmDelete = () => {
    if (user) {
      const { userEmail, userToken } = user
      deleteCategoryIndicator({
        variables: {
          id: categoryIndicator.id
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
        title={format('app.deletingEntity', { entity: categoryIndicator.name })}
        message={format('delete.confirm.message', { entity: format('categoryIndicator.label') })}
        isOpen={displayConfirmDialog}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
  )
}

export default DeleteCategoryIndicator
