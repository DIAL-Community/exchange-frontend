import { useIntl } from 'react-intl'
import { useCallback, useContext, useState } from 'react'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { DEFAULT_PAGE_SIZE, REBRAND_BASE_PATH } from '../utils/constants'
import { ToastContext } from '../../../lib/ToastContext'
import { useUser } from '../../../lib/hooks'
import { DELETE_SDG } from '../shared/mutation/sdg'
import { PAGINATED_SDGS_QUERY, SDG_DETAIL_QUERY } from '../shared/query/sdg'
import DeleteButton from '../shared/form/DeleteButton'
import ConfirmActionDialog from '../shared/form/ConfirmActionDialog'

const DeleteSdg = ({ sdg }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showToast } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const { user } = useUser()

  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false)
  const toggleConfirmDialog = () => setDisplayConfirmDialog(!displayConfirmDialog)

  const [deleteSdg, { called, reset }] = useMutation(DELETE_SDG, {
    refetchQueries: [{
      query: SDG_DETAIL_QUERY,
      variables: { slug: sdg.slug }
    }, {
      query: PAGINATED_SDGS_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 }
    }],
    onCompleted: (data) => {
      const { deleteSdg: response } = data
      if (response?.sdg && response?.errors?.length === 0) {
        setDisplayConfirmDialog(false)
        showToast(
          format('toast.sdg.delete.success'),
          'success',
          'top-center',
          1000,
          null,
          () => router.push(`${REBRAND_BASE_PATH}/sdgs`)
        )
      } else {
        setDisplayConfirmDialog(false)
        showToast(format('toast.sdg.delete.failure'), 'error', 'top-center')
        reset()
      }
    },
    onError: () => {
      setDisplayConfirmDialog(false)
      showToast(format('toast.sdg.delete.failure'), 'error', 'top-center')
      reset()
    }
  })

  const onConfirmDelete = () => {
    if (user) {
      const { userEmail, userToken } = user
      deleteSdg({
        variables: {
          id: sdg.id
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
        title={format('app.deletingEntity', { entity: sdg.name })}
        message={format('sdg.delete.confirm.message')}
        isOpen={displayConfirmDialog}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
  )
}

export default DeleteSdg
