import { useIntl } from 'react-intl'
import { useCallback, useContext, useState } from 'react'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import DeleteButton from '../shared/DeleteButton'
import ConfirmActionDialog from '../shared/ConfirmActionDialog'
import { DEFAULT_AUTO_CLOSE_DELAY, ToastContext } from '../../lib/ToastContext'
import { DELETE_PRODUCT } from '../../mutations/product'
import { useUser } from '../../lib/hooks'
import { PRODUCT_QUERY } from '../../queries/product'

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
      query: PRODUCT_QUERY,
      variables: { slug: product.slug }
    }],
    onCompleted: (data) => {
      const { deleteProduct: response } = data
      if (response?.product && response?.errors?.length === 0) {
        setDisplayConfirmDialog(false)
        showToast(
          format('toast.product.delete.success'),
          'success',
          'top-center',
          DEFAULT_AUTO_CLOSE_DELAY,
          null,
          () => router.push('/products')
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
