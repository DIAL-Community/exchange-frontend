import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useMutation, useQuery } from '@apollo/client'
import { DELETING_POLICY_SLUG, GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import ConfirmActionDialog from '../../shared/form/ConfirmActionDialog'
import DeleteButton from '../../shared/form/DeleteButton'
import { DELETE_RUBRIC_CATEGORY } from '../../shared/mutation/rubricCategory'
import { RUBRIC_CATEGORY_POLICY_QUERY, RUBRIC_CATEGORY_SEARCH_QUERY } from '../../shared/query/rubricCategory'

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
          () => router.push(`/${locale}/rubric-categories`)
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
      deleteRubricCategory({
        variables: {
          id: rubricCategory.id
        },
        context: {
          headers: {
            'Accept-Language': locale
          }
        }
      })
    }
  }

  const { error } = useQuery(RUBRIC_CATEGORY_POLICY_QUERY, {
    variables: { slug: DELETING_POLICY_SLUG },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.DELETING
      }
    }
  })

  return !error && (
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
