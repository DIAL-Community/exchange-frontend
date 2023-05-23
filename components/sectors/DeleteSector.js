import { useIntl } from 'react-intl'
import { useCallback, useContext, useState } from 'react'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import DeleteButton from '../shared/DeleteButton'
import ConfirmActionDialog from '../shared/ConfirmActionDialog'
import { ToastContext } from '../../lib/ToastContext'
import { DELETE_SECTOR } from '../../mutations/sector'
import { SECTORS_LIST_QUERY } from '../../queries/sector'
import { useUser } from '../../lib/hooks'

const DeleteSector = ({ sector }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showToast } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const { user } = useUser()

  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false)

  const toggleConfirmDialog = () => setDisplayConfirmDialog(!displayConfirmDialog)

  const [deleteSector, { called, reset }] = useMutation(DELETE_SECTOR, {
    refetchQueries: [{ SECTORS_LIST_QUERY }],
    onCompleted: (data) => {
      const { deleteSector: response } = data
      if (response?.sector && response?.errors?.length === 0) {
        showToast(format('toast.sector.delete.success'), 'success', 'top-center')
        setDisplayConfirmDialog(false)
      } else {
        showToast(format('toast.sector.delete.failure'), 'error', 'top-center')
        setDisplayConfirmDialog(false)
        reset()
      }
    },
    onError: () => {
      showToast(format('toast.sector.delete.failure'), 'error', 'top-center')
      setDisplayConfirmDialog(false)
      reset()
    }
  })

  const onConfirmDelete = () => {
    if (user) {
      const { userEmail, userToken } = user

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
      <DeleteButton type='button' onClick={toggleConfirmDialog} />
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
