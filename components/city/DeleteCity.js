import { useIntl } from 'react-intl'
import { useCallback, useContext, useState } from 'react'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { DEFAULT_PAGE_SIZE } from '../utils/constants'
import { ToastContext } from '../../lib/ToastContext'
import { useUser } from '../../lib/hooks'
import { DELETE_CITY } from '../shared/mutation/city'
import { PAGINATED_CITIES_QUERY, CITY_DETAIL_QUERY } from '../shared/query/city'
import DeleteButton from '../shared/form/DeleteButton'
import ConfirmActionDialog from '../shared/form/ConfirmActionDialog'

const DeleteCity = ({ city }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const { user } = useUser()

  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false)
  const toggleConfirmDialog = () => setDisplayConfirmDialog(!displayConfirmDialog)

  const [deleteCity, { called, reset }] = useMutation(DELETE_CITY, {
    refetchQueries: [{
      query: CITY_DETAIL_QUERY,
      variables: { slug: city.slug }
    }, {
      query: PAGINATED_CITIES_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 }
    }],
    onCompleted: (data) => {
      const { deleteCity: response } = data
      if (response?.city && response?.errors?.length === 0) {
        setDisplayConfirmDialog(false)
        showSuccessMessage(
          format('toast.delete.success', { entity: format('ui.city.label') }),
          () => router.push(`/${locale}/cities`)
        )
      } else {
        setDisplayConfirmDialog(false)
        showFailureMessage(format('toast.delete.failure', { entity: format('ui.city.label') }))
        reset()
      }
    },
    onError: () => {
      setDisplayConfirmDialog(false)
      showFailureMessage(format('toast.delete.failure', { entity: format('ui.city.label') }))
      reset()
    }
  })

  const onConfirmDelete = () => {
    if (user) {
      const { userEmail, userToken } = user
      deleteCity({
        variables: {
          id: city.id
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
        title={format('app.deletingEntity', { entity: city.name })}
        message={format('delete.confirm.message', { entity: format('ui.city.label') })}
        isOpen={displayConfirmDialog}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
  )
}

export default DeleteCity
