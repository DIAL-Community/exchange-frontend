import { useIntl } from 'react-intl'
import { useCallback, useContext, useState } from 'react'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { ToastContext } from '../../../lib/ToastContext'
import { useUser } from '../../../lib/hooks'
import { DELETE_RUBRIC_CATEGORY } from '../shared/mutation/rubricCategory'
import { RUBRIC_CATEGORY_SEARCH_QUERY } from '../shared/query/rubricCategory'
import DeleteButton from '../shared/form/DeleteButton'
import ConfirmActionDialog from '../shared/form/ConfirmActionDialog'

const DeleteRubricCategory = ({ rubricCategory }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const { user } = useUser()

  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false)
  const toggleConfirmDialog = () => setDisplayConfirmDialog(!displayConfirmDialog)

  const [deleteRubricCategory, { called, reset }] = useMutation(DELETE_RUBRIC_CATEGORY, {
    refetchQueries: [{
      query: RUBRIC_CATEGORY_SEARCH_QUERY,
      variables: { search: '' }
    }],
    onCompleted: (data) => {
      const { deleteRubricCategory: response } = data
      if (response?.rubricCategory && response?.errors?.length === 0) {
        setDisplayConfirmDialog(false)
        showSuccessMessage(
          format('toast.delete.success', { entity: format('ui.rubricCategory.label') }),
          () => router.push(`/${locale}/rubricCategories`)
        )
      } else {
        setDisplayConfirmDialog(false)
        showFailureMessage(format('toast.delete.failure', { entity: format('ui.rubricCategory.label') }))
        reset()
      }
    },
    onError: () => {
      setDisplayConfirmDialog(false)
      showFailureMessage(format('toast.delete.failure', { entity: format('ui.rubricCategory.label') }))
      reset()
    }
  })

  const onConfirmDelete = () => {
    if (user) {
      const { userEmail, userToken } = user
      deleteRubricCategory({
        variables: {
          id: rubricCategory.id
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
        title={format('app.deletingEntity', { entity: rubricCategory.name })}
        message={format('delete.confirm.message', { entity: format('ui.rubricCategory.label') })}
        isOpen={displayConfirmDialog}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
  )
}

export default DeleteRubricCategory
