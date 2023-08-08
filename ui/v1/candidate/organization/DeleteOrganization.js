import { useIntl } from 'react-intl'
import { useCallback, useContext, useState } from 'react'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { DEFAULT_PAGE_SIZE, REBRAND_BASE_PATH } from '../../utils/constants'
import { ToastContext } from '../../../../lib/ToastContext'
import { useUser } from '../../../../lib/hooks'
import { DELETE_ORGANIZATION } from '../../shared/mutation/organization'
import {
  CANDIDATE_ORGANIZATION_DETAIL_QUERY,
  PAGINATED_CANDIDATE_ORGANIZATIONS_QUERY
} from '../../shared/query/candidateOrganization'
import DeleteButton from '../../shared/form/DeleteButton'
import ConfirmActionDialog from '../../shared/form/ConfirmActionDialog'

const DeleteOrganization = ({ organization }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showToast } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const { user } = useUser()

  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false)
  const toggleConfirmDialog = () => setDisplayConfirmDialog(!displayConfirmDialog)

  const [deleteOrganization, { called, reset }] = useMutation(DELETE_ORGANIZATION, {
    refetchQueries: [{
      query: CANDIDATE_ORGANIZATION_DETAIL_QUERY,
      variables: { slug: organization.slug }
    }, {
      query: PAGINATED_CANDIDATE_ORGANIZATIONS_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 }
    }],
    onCompleted: (data) => {
      const { deleteOrganization: response } = data
      if (response?.organization && response?.errors?.length === 0) {
        setDisplayConfirmDialog(false)
        showToast(
          format('toast.organization.delete.success'),
          'success',
          'top-center',
          1000,
          null,
          () => router.push(`${REBRAND_BASE_PATH}/organizations`)
        )
      } else {
        setDisplayConfirmDialog(false)
        showToast(format('toast.organization.delete.failure'), 'error', 'top-center')
        reset()
      }
    },
    onError: () => {
      setDisplayConfirmDialog(false)
      showToast(format('toast.organization.delete.failure'), 'error', 'top-center')
      reset()
    }
  })

  const onConfirmDelete = () => {
    if (user) {
      const { userEmail, userToken } = user
      deleteOrganization({
        variables: {
          id: organization.id
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
        title={format('app.deletingEntity', { entity: organization.name })}
        message={format('organization.delete.confirm.message')}
        isOpen={displayConfirmDialog}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
  )
}

export default DeleteOrganization
