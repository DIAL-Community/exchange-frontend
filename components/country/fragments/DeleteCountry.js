import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { ToastContext } from '../../../lib/ToastContext'
import ConfirmActionDialog from '../../shared/form/ConfirmActionDialog'
import DeleteButton from '../../shared/form/DeleteButton'
import { DELETE_COUNTRY } from '../../shared/mutation/country'
import { COUNTRY_DETAIL_QUERY, PAGINATED_COUNTRIES_QUERY } from '../../shared/query/country'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'

const DeleteCountry = ({ country }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false)
  const toggleConfirmDialog = () => setDisplayConfirmDialog(!displayConfirmDialog)

  const [deleteCountry, { called, reset }] = useMutation(DELETE_COUNTRY, {
    refetchQueries: [{
      query: COUNTRY_DETAIL_QUERY,
      variables: { slug: country.slug },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
    }, {
      query: PAGINATED_COUNTRIES_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
    }],
    onCompleted: (data) => {
      const { deleteCountry: response } = data
      if (response?.country && response?.errors?.length === 0) {
        setDisplayConfirmDialog(false)
        showSuccessMessage(
          format('toast.delete.success', { entity: format('ui.country.label') }),
          () => router.push(`/${locale}/countries`)
        )
      } else {
        setDisplayConfirmDialog(false)
        showFailureMessage(format('toast.country.delete.failure', { entity: format('ui.country.label') }))
        reset()
      }
    },
    onError: () => {
      setDisplayConfirmDialog(false)
      showFailureMessage(format('toast.country.delete.failure', { entity: format('ui.country.label') }))
      reset()
    }
  })

  const onConfirmDelete = () => {
    deleteCountry({
      variables: {
        id: country.id
      },
      context: {
        headers: {
          'Accept-Language': locale
        }
      }
    })
  }

  return (
    <>
      <DeleteButton type='button' onClick={toggleConfirmDialog} />
      <ConfirmActionDialog
        title={format('app.deletingEntity', { entity: country.name })}
        message={format('delete.confirm.message', { entity: format('ui.country.label') })}
        isOpen={displayConfirmDialog}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
  )
}

export default DeleteCountry
