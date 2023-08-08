import { useIntl } from 'react-intl'
import { useCallback, useContext, useState } from 'react'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { DEFAULT_PAGE_SIZE, REBRAND_BASE_PATH } from '../../utils/constants'
import { ToastContext } from '../../../../lib/ToastContext'
import { useUser } from '../../../../lib/hooks'
import { DELETE_ROLE } from '../../shared/mutation/role'
import {
  CANDIDATE_ROLE_DETAIL_QUERY,
  PAGINATED_CANDIDATE_ROLES_QUERY
} from '../../shared/query/candidateRole'
import DeleteButton from '../../shared/form/DeleteButton'
import ConfirmActionDialog from '../../shared/form/ConfirmActionDialog'

const DeleteRole = ({ role }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showToast } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const { user } = useUser()

  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false)
  const toggleConfirmDialog = () => setDisplayConfirmDialog(!displayConfirmDialog)

  const [deleteRole, { called, reset }] = useMutation(DELETE_ROLE, {
    refetchQueries: [{
      query: CANDIDATE_ROLE_DETAIL_QUERY,
      variables: { slug: role.slug }
    }, {
      query: PAGINATED_CANDIDATE_ROLES_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 }
    }],
    onCompleted: (data) => {
      const { deleteRole: response } = data
      if (response?.role && response?.errors?.length === 0) {
        setDisplayConfirmDialog(false)
        showToast(
          format('toast.role.delete.success'),
          'success',
          'top-center',
          1000,
          null,
          () => router.push(`${REBRAND_BASE_PATH}/roles`)
        )
      } else {
        setDisplayConfirmDialog(false)
        showToast(format('toast.role.delete.failure'), 'error', 'top-center')
        reset()
      }
    },
    onError: () => {
      setDisplayConfirmDialog(false)
      showToast(format('toast.role.delete.failure'), 'error', 'top-center')
      reset()
    }
  })

  const onConfirmDelete = () => {
    if (user) {
      const { userEmail, userToken } = user
      deleteRole({
        variables: {
          id: role.id
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
        title={format('app.deletingEntity', { entity: role.name })}
        message={format('role.delete.confirm.message')}
        isOpen={displayConfirmDialog}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
  )
}

export default DeleteRole
