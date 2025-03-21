import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { ToastContext } from '../../../lib/ToastContext'
import ConfirmActionDialog from '../../shared/form/ConfirmActionDialog'
import DeleteButton from '../../shared/form/DeleteButton'
import { DELETE_CATEGORY_INDICATOR } from '../../shared/mutation/categoryIndicator'
import { RUBRIC_CATEGORY_QUERY } from '../../shared/query/rubricCategory'

const DeleteCategoryIndicator = ({ rubricCategory, categoryIndicator }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false)
  const toggleConfirmDialog = () => setDisplayConfirmDialog(!displayConfirmDialog)

  const [deleteCategoryIndicator, { called, reset }] = useMutation(DELETE_CATEGORY_INDICATOR, {
    refetchQueries: [{
      query: RUBRIC_CATEGORY_QUERY,
      variables: { slug: rubricCategory.slug },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
    }],
    onCompleted: (data) => {
      const { deleteCategoryIndicator: response } = data
      if (response?.categoryIndicator && response?.errors?.length === 0) {
        setDisplayConfirmDialog(false)
        showSuccessMessage(
          format('toast.delete.success', { entity: format('categoryIndicator.label') }),
          () => router.push(`/${locale}/rubric-categories/${rubricCategory.slug}`)
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
    deleteCategoryIndicator({
      variables: {
        id: categoryIndicator.id
      },
      context: {
        headers: {
          'Accept-Language': locale
        }
      }
    })
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
