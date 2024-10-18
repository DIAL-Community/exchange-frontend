import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { useUser } from '../../lib/hooks'
import { ToastContext } from '../../lib/ToastContext'
import ConfirmActionDialog from '../shared/form/ConfirmActionDialog'
import DeleteButton from '../shared/form/DeleteButton'
import { DELETE_PRODUCT } from '../shared/mutation/product'
import { PAGINATED_PRODUCTS_QUERY, PRODUCT_DETAIL_QUERY } from '../shared/query/product'
import { DEFAULT_PAGE_SIZE } from '../utils/constants'

const DeleteProduct = ({ product }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const { user } = useUser()

  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false)
  const toggleConfirmDialog = () => setDisplayConfirmDialog(!displayConfirmDialog)

  const [deleteProduct, { called, reset }] = useMutation(DELETE_PRODUCT, {
    refetchQueries: [{
      query: PRODUCT_DETAIL_QUERY,
      variables: { slug: product.slug }
    }, {
      query: PAGINATED_PRODUCTS_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 }
    }],
    onCompleted: (data) => {
      const { deleteProduct: response } = data
      if (response?.product && response?.errors?.length === 0) {
        setDisplayConfirmDialog(false)
        showSuccessMessage(
          format('toast.delete.success', { entity: format('ui.product.label') }),
          () => router.push(`/${locale}/products`)
        )
      } else {
        setDisplayConfirmDialog(false)
        showFailureMessage(format('toast.delete.failure', { entity: format('ui.product.label') }))
        reset()
      }
    },
    onError: () => {
      setDisplayConfirmDialog(false)
      showFailureMessage(format('toast.delete.failure', { entity: format('ui.product.label') }))
      reset()
    }
  })

  const onConfirmDelete = () => {
    if (user) {
      deleteProduct({
        variables: {
          id: product.id
        },
        context: {
          headers: {
            'Accept-Language': locale
          }
        }
      })
    }
  }

  return (
    <>
      <DeleteButton type='button' onClick={toggleConfirmDialog} />
      <ConfirmActionDialog
        title={format('app.deletingEntity', { entity: product.name })}
        message={format('delete.confirm.message', { entity: format('ui.product.label') })}
        isOpen={displayConfirmDialog}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
  )
}

export default DeleteProduct
