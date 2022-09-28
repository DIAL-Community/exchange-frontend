import { useIntl } from 'react-intl'
import { useSession } from 'next-auth/react'
import { useCallback, useContext, useState } from 'react'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import DeleteButton from '../shared/DeleteButton'
import ConfirmActionDialog from '../shared/ConfirmActionDialog'
import { ToastContext } from '../../lib/ToastContext'
import { DELETE_COUNTRY } from '../../mutations/country'

const DeleteCountry = ({ country }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showToast } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const { data: session } = useSession()

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)

  const toggleConfirmDialog = () => {
    setIsConfirmDialogOpen(!isConfirmDialogOpen)
  }

  const [deleteCountry, { called, reset }] = useMutation(DELETE_COUNTRY, {
    onCompleted: () => {
      showToast(
        format('toast.country.delete.success'),
        'success',
        'top-center',
        null,
        () => router.push(`/${locale}/countries`)
      )
      setIsConfirmDialogOpen(false)
    },
    onError: () => {
      showToast(format('toast.country.delete.failure'), 'error', 'top-center')
      setIsConfirmDialogOpen(false)
      reset()
    }
  })

  const onConfirmDelete = () => {
    if (session) {
      const { userEmail, userToken } = session.user

      deleteCountry({
        variables: {
          id: country.id
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
        title={format('app.deleting-entity', { entity: country.name })}
        message={format('country.delete.confirm.message')}
        isOpen={isConfirmDialogOpen}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
  )
}

export default DeleteCountry
