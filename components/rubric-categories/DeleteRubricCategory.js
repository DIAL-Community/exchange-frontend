import { useMutation } from '@apollo/client'
import { useSession } from 'next-auth/react'
import router, { useRouter } from 'next/router'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { DEFAULT_AUTO_CLOSE_DELAY, ToastContext } from '../../lib/ToastContext'
import ConfirmActionDialog from '../shared/ConfirmActionDialog'
import DeleteButton from '../shared/DeleteButton'
import { DELETE_RUBRIC_CATEGORY } from '../../mutations/rubric-category'

const DeleteRubricCategory = ({ rubricCategory }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false)

  const { locale } = useRouter()

  const { data: session } = useSession()

  const { showToast } = useContext(ToastContext)

  const [deleteRubricCategory, { called, reset }] = useMutation(DELETE_RUBRIC_CATEGORY, {
    onCompleted: () => {
      showToast(
        format('toast.rubric-category.delete.success'),
        'success',
        'top-center',
        DEFAULT_AUTO_CLOSE_DELAY,
        null,
        () => router.push('/rubric_categories')
      )
    },
    onError: () => {
      showToast(format('toast.rubric-category.delete.failure'), 'error', 'top-center')
      setDisplayConfirmDialog(false)
      reset()
    }
  })

  const onConfirmDelete = () => {
    if (session) {
      const { userEmail, userToken } = session.user

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
