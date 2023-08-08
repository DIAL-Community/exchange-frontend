import { useIntl } from 'react-intl'
import { useCallback, useContext, useState } from 'react'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { DEFAULT_PAGE_SIZE, REBRAND_BASE_PATH } from '../../utils/constants'
import { ToastContext } from '../../../../lib/ToastContext'
import { useUser } from '../../../../lib/hooks'
import { DELETE_PRODUCT } from '../../shared/mutation/product'
import {
  CANDIDATE_PRODUCT_DETAIL_QUERY,
  PAGINATED_CANDIDATE_PRODUCTS_QUERY
} from '../../shared/query/candidateProduct'
import DeleteButton from '../../shared/form/DeleteButton'
import ConfirmActionDialog from '../../shared/form/ConfirmActionDialog'

const DeleteProduct = ({ product }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showToast } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const { user } = useUser()

  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false)
  const toggleConfirmDialog = () => setDisplayConfirmDialog(!displayConfirmDialog)

  const [deleteProduct, { called, reset }] = useMutation(DELETE_PRODUCT, {
    refetchQueries: [{
      query: CANDIDATE_PRODUCT_DETAIL_QUERY,
      variables: { slug: product.slug }
    }, {
      query: PAGINATED_CANDIDATE_PRODUCTS_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 }
    }],
    onCompleted: (data) => {
      const { deleteProduct: response } = data
      if (response?.product && response?.errors?.length === 0) {
        setDisplayConfirmDialog(false)
        showToast(
          format('toast.product.delete.success'),
          'success',
          'top-center',
          1000,
          null,
          () => router.push(`${REBRAND_BASE_PATH}/products`)
        )
      } else {
        setDisplayConfirmDialog(false)
        showToast(format('toast.product.delete.failure'), 'error', 'top-center')
        reset()
      }
    },
    onError: () => {
      setDisplayConfirmDialog(false)
      showToast(format('toast.product.delete.failure'), 'error', 'top-center')
      reset()
    }
  })

  const onConfirmDelete = () => {
    if (user) {
      const { userEmail, userToken } = user
      deleteProduct({
        variables: {
          id: product.id
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
        title={format('app.deletingEntity', { entity: product.name })}
        message={format('product.delete.confirm.message')}
        isOpen={displayConfirmDialog}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
  )
}

export default DeleteProduct
