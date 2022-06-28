import { useMutation } from '@apollo/client'
import { useSession } from 'next-auth/client'
import router, { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { DEFAULT_AUTO_CLOSE_DELAY, ToastContext } from '../../lib/ToastContext'
import { DELETE_ORGANIZATION } from '../../mutations/organization'
import ConfirmActionDialog from '../shared/ConfirmActionDialog'
import DeleteButton from '../shared/DeleteButton'

const DeleteOrganization = ({ organization }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)
  
  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false)
  
  const { locale } = useRouter()
    
  const [session] = useSession()
  
  const { showToast } = useContext(ToastContext)

  const [deleteOrganization, { called, reset }] = useMutation(DELETE_ORGANIZATION, {
    onCompleted: () => {  
      showToast(
        format('toast.organization.delete.success'),
        'success',
        'top-center',
        DEFAULT_AUTO_CLOSE_DELAY,
        null,
        () => router.push(`/${router.locale}/organizations`)
      )
    },
    onError: () => {
      showToast(format('toast.organization.delete.failure'), 'error', 'top-center')
      setDisplayConfirmDialog(false)
      reset()
    }
  })
  
  const onConfirmDelete = () => {
    if (session) {
      const { userEmail, userToken } = session.user

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
