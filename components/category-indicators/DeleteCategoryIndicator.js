import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { DEFAULT_AUTO_CLOSE_DELAY, ToastContext } from '../../lib/ToastContext'
import ConfirmActionDialog from '../shared/ConfirmActionDialog'
import DeleteButton from '../shared/DeleteButton'
import { DELETE_CATEGORY_INDICATOR } from '../../mutations/category-indicator'
import { CATEGORY_INDICATOR_QUERY } from '../../queries/category-indicator'
import { useUser } from '../../lib/hooks'

const DeleteCategoryIndicator = ({ categoryIndicator }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false)

  const router = useRouter()
  const { locale } = router

  const { user } = useUser()

  const { showToast } = useContext(ToastContext)

  const [deleteCategoryIndicator, { called, reset }] = useMutation(DELETE_CATEGORY_INDICATOR, {
    refetchQueries: [{
      query: CATEGORY_INDICATOR_QUERY,
      variables: { slug: categoryIndicator.slug }
    }],
    onCompleted: (data) => {
      const { deleteCategoryIndicator: response } = data
      if (response?.rubricCategorySlug && response?.errors?.length === 0) {
        setDisplayConfirmDialog(false)
        showToast(
          format('toast.category-indicator.delete.success'),
          'success',
          'top-center',
          DEFAULT_AUTO_CLOSE_DELAY,
          null,
          () => router.push(`/rubric_categories/${response?.rubricCategorySlug}`)
        )
      } else {
        showToast(format('toast.category-indicator.delete.failure'), 'error', 'top-center')
        setDisplayConfirmDialog(false)
        reset()
      }
    },
    onError: () => {
      showToast(format('toast.category-indicator.delete.failure'), 'error', 'top-center')
      setDisplayConfirmDialog(false)
      reset()
    }
  })

  const onConfirmDelete = () => {
    if (user) {
      const { userEmail, userToken } = user

      deleteCategoryIndicator({
        variables: { id: categoryIndicator.id },
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
        title={format('app.deleting-entity', { entity: categoryIndicator.name })}
        message={format('categoryIndicator.delete.confirm.message')}
        isOpen={displayConfirmDialog}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
  )
}

export default DeleteCategoryIndicator
