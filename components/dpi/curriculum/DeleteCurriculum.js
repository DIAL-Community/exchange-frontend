import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { useUser } from '../../../lib/hooks'
import { DEFAULT_AUTO_CLOSE_DELAY, ToastContext } from '../../../lib/ToastContext'
import ConfirmActionDialog from '../../shared/form/ConfirmActionDialog'
import DeleteButton from '../../shared/form/DeleteButton'
import { DELETE_PLAYBOOK } from '../../shared/mutation/playbook'
import { PLAYBOOK_DETAIL_QUERY } from '../../shared/query/play'

const DeleteCurriculum = ({ curriculum }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showToast } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const { user } = useUser()
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)

  const toggleConfirmDialog = () => {
    setIsConfirmDialogOpen(!isConfirmDialogOpen)
  }

  const [deleteCurriculum, { called, reset }] = useMutation(DELETE_PLAYBOOK, {
    refetchQueries: [{
      query: PLAYBOOK_DETAIL_QUERY,
      variables: { slug: curriculum.slug, owner: 'dpi' }
    }],
    onCompleted: (data) => {
      const { deleteCurriculum: response } = data
      if (response?.curriculum && response?.errors?.length === 0) {
        showToast(
          format('toast.curriculum.delete.success'),
          'success',
          'top-center',
          DEFAULT_AUTO_CLOSE_DELAY,
          null,
          () => router.push(`/${locale}/curriculums`)
        )
        setIsConfirmDialogOpen(false)
      } else {
        showToast(format('toast.curriculum.delete.failure'), 'error', 'top-center')
        setIsConfirmDialogOpen(false)
        reset()
      }
    },
    onError: () => {
      showToast(format('toast.curriculum.delete.failure'), 'error', 'top-center')
      setIsConfirmDialogOpen(false)
      reset()
    }
  })

  const onConfirmDelete = () => {
    if (user) {
      const { userEmail, userToken } = user

      deleteCurriculum({
        variables: {
          id: curriculum.id
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
      <DeleteButton type='button' onClick={toggleConfirmDialog}/>
      <ConfirmActionDialog
        title={format('app.deletingEntity', { entity: curriculum.name })}
        message={format('ui.curriculum.delete.confirm.message')}
        isOpen={isConfirmDialogOpen}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
  )
}

export default DeleteCurriculum
