import { useIntl } from 'react-intl'
import { useCallback, useContext, useState } from 'react'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import DeleteButton from '../shared/DeleteButton'
import ConfirmActionDialog from '../shared/ConfirmActionDialog'
import { ToastContext } from '../../lib/ToastContext'
import { DELETE_COUNTRY } from '../../mutations/country'
import { COUNTRY_DETAIL_QUERY } from '../../queries/country'
import { useUser } from '../../lib/hooks'

const DeleteCountry = ({ country }) => {
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

  const [deleteCountry, { called, reset }] = useMutation(DELETE_COUNTRY, {
    refetchQueries: [{
      query: COUNTRY_DETAIL_QUERY,
      variables: { slug: country.slug }
    }],
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
    if (user) {
      const { userEmail, userToken } = user

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
