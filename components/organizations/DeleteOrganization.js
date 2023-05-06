import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useUser } from '../../lib/hooks'
import { DEFAULT_AUTO_CLOSE_DELAY, ToastContext } from '../../lib/ToastContext'
import { DELETE_ORGANIZATION } from '../../mutations/organization'
import { ORGANIZATION_QUERY } from '../../queries/organization'
import ConfirmActionDialog from '../shared/ConfirmActionDialog'
import DeleteButton from '../shared/DeleteButton'

const DeleteOrganization = ({ organization }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false)

  const router = useRouter()
  const { locale } = router

  const { user } = useUser()

  const { showToast } = useContext(ToastContext)

  const [deleteOrganization, { called, reset }] = useMutation(DELETE_ORGANIZATION, {
    refetchQueries: [{
      query: ORGANIZATION_QUERY,
      variables: { slug: organization.slug }
    }],
    onCompleted: (data) => {
      const { deleteOrganization: response } = data
      if (response?.organization && response?.errors?.length === 0) {
        showToast(
          format('toast.organization.delete.success'),
          'success',
          'top-center',
          DEFAULT_AUTO_CLOSE_DELAY,
          null,
          () => router.push(`/${router.locale}/organizations`)
        )
        setDisplayConfirmDialog(false)
      } else {
        showToast(format('toast.organization.delete.failure'), 'error', 'top-center')
        setDisplayConfirmDialog(false)
        reset()
      }
    },
    onError: () => {
      showToast(format('toast.organization.delete.failure'), 'error', 'top-center')
      setDisplayConfirmDialog(false)
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

  const toggleConfirmDialog = () => {
    setDisplayConfirmDialog(!displayConfirmDialog)
  }

  return (
    <>
      <DeleteButton type='button' onClick={toggleConfirmDialog} />
      <ConfirmActionDialog
        title={format('app.deleting-entity', { entity: organization.name })}
        message={format('organization.delete.confirm.message')}
        isOpen={displayConfirmDialog}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
  )
}

export default DeleteOrganization
