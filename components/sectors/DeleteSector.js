import { useIntl } from 'react-intl'
import { useSession } from 'next-auth/client'
import { useContext, useState } from 'react'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import DeleteButton from '../shared/DeleteButton'
import ConfirmActionDialog from '../shared/ConfirmActionDialog'
import { ToastContext } from '../../lib/ToastContext'
import { DELETE_SECTOR } from '../../mutations/sectors'

const DeleteSector = ({ sector }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  const { showToast } = useContext(ToastContext)

  const router = useRouter()

  const { locale } = router

  const [session] = useSession()

  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false)

  const toggleConfirmDialog = () => {
    event.stopPropagation()
    setDisplayConfirmDialog(!displayConfirmDialog)     
  }

  const [deleteSector, { called, reset }] = useMutation(DELETE_SECTOR, {
    refetchQueries: ['SearchSectors'],
    onCompleted: () => {
      showToast(format('toast.sector.delete.success'), 'success', 'top-center')
      setDisplayConfirmDialog(false)
    },
    onError: () => {
      showToast(format('toast.sector.delete.failure'), 'error', 'top-center')
      setDisplayConfirmDialog(false)
      reset()
    }
  })

  const onConfirmDelete = () => {
    if (session) {
      const { userEmail, userToken } = session.user

      deleteSector({
        variables: {
          id: sector.id
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
      <DeleteButton type='button' onClick={(event) => {
        event.stopPropagation()
        toggleConfirmDialog()
      }} />
      <ConfirmActionDialog
        title={format('app.deleting-entity', { entity: sector.name })}
        message={format('sector.delete.confirm.message')}
        isOpen={displayConfirmDialog}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
  )
}

export default DeleteSector
