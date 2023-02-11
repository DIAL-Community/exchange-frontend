import { useMutation } from '@apollo/client'
import router, { useRouter } from 'next/router'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { DEFAULT_AUTO_CLOSE_DELAY, ToastContext } from '../../lib/ToastContext'
import ConfirmActionDialog from '../shared/ConfirmActionDialog'
import DeleteButton from '../shared/DeleteButton'
import { DELETE_RUBRIC_CATEGORY } from '../../mutations/rubric-category'
import { RUBRIC_CATEGORY_QUERY } from '../../queries/rubric-category'
import { useUser } from '../../lib/hooks'

const DeleteRubricCategory = ({ rubricCategory }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false)

  const { locale } = useRouter()

  const { user } = useUser()

  const { showToast } = useContext(ToastContext)

  const [deleteRubricCategory, { called, reset }] = useMutation(DELETE_RUBRIC_CATEGORY, {
    refetchQueries: [{
      query: RUBRIC_CATEGORY_QUERY,
      variables: { slug: rubricCategory.slug }
    }],
    onCompleted: (data) => {
      const { deleteRubricCategory: response } = data
      if (response?.errors?.length === 0) {
        setDisplayConfirmDialog(false)
        showToast(
          format('toast.rubric-category.delete.success'),
          'success',
          'top-center',
          DEFAULT_AUTO_CLOSE_DELAY,
          null,
          () => router.push('/rubric_categories')
        )
      } else {
        showToast(format('toast.rubric-category.delete.failure'), 'error', 'top-center')
        setDisplayConfirmDialog(false)
        reset()
      }
    },
    onError: () => {
      showToast(format('toast.rubric-category.delete.failure'), 'error', 'top-center')
      setDisplayConfirmDialog(false)
      reset()
    }
  })

  const onConfirmDelete = () => {
    if (user) {
      const { userEmail, userToken } = user

      deleteRubricCategory({
        variables: { id: rubricCategory.id },
        context: {
          headers: {
            'Accept-Language': locale,
            Authorization: `${userEmail} ${userToken}`
          }
        }
      })
    }
  }

  const toggleConfirmDialog = () => setDisplayConfirmDialog(!displayConfirmDialog)

  return (
    <>
      <DeleteButton type='button' onClick={toggleConfirmDialog} />
      <ConfirmActionDialog
        title={format('app.deleting-entity', { entity: rubricCategory.name })}
        message={format('rubric-category.delete.confirm.message')}
        isOpen={displayConfirmDialog}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
  )
}

export default DeleteRubricCategory
