import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useMutation, useQuery } from '@apollo/client'
import { DELETING_POLICY_SLUG, GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import ConfirmActionDialog from '../../shared/form/ConfirmActionDialog'
import DeleteButton from '../../shared/form/DeleteButton'
import { DELETE_CATEGORY_INDICATOR } from '../../shared/mutation/categoryIndicator'
import { CATEGORY_INDICATOR_POLICY_QUERY, CATEGORY_INDICATOR_SEARCH_QUERY } from '../../shared/query/categoryIndicator'

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
          () => router.push(`/${locale}/category-indicators`)
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
  }

  const { error } = useQuery(CATEGORY_INDICATOR_POLICY_QUERY, {
    variables: { categorySlug: DELETING_POLICY_SLUG, indicatorSlug: DELETING_POLICY_SLUG },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.DELETING
      }
    }
  })

  return !error &&
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
}

export default DeleteCategoryIndicator
