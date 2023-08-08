import { useIntl } from 'react-intl'
import { useCallback, useContext, useState } from 'react'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { DEFAULT_PAGE_SIZE, REBRAND_BASE_PATH } from '../../utils/constants'
import { ToastContext } from '../../../../lib/ToastContext'
import { useUser } from '../../../../lib/hooks'
import { DELETE_DATASET } from '../../shared/mutation/dataset'
import {
  CANDIDATE_DATASET_DETAIL_QUERY,
  PAGINATED_CANDIDATE_DATASETS_QUERY
} from '../../shared/query/candidateDataset'
import DeleteButton from '../../shared/form/DeleteButton'
import ConfirmActionDialog from '../../shared/form/ConfirmActionDialog'

const DeleteDataset = ({ dataset }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showToast } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const { user } = useUser()

  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false)
  const toggleConfirmDialog = () => setDisplayConfirmDialog(!displayConfirmDialog)

  const [deleteDataset, { called, reset }] = useMutation(DELETE_DATASET, {
    refetchQueries: [{
      query: CANDIDATE_DATASET_DETAIL_QUERY,
      variables: { slug: dataset.slug }
    }, {
      query: PAGINATED_CANDIDATE_DATASETS_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 }
    }],
    onCompleted: (data) => {
      const { deleteDataset: response } = data
      if (response?.dataset && response?.errors?.length === 0) {
        setDisplayConfirmDialog(false)
        showToast(
          format('toast.dataset.delete.success'),
          'success',
          'top-center',
          1000,
          null,
          () => router.push(`${REBRAND_BASE_PATH}/datasets`)
        )
      } else {
        setDisplayConfirmDialog(false)
        showToast(format('toast.dataset.delete.failure'), 'error', 'top-center')
        reset()
      }
    },
    onError: () => {
      setDisplayConfirmDialog(false)
      showToast(format('toast.dataset.delete.failure'), 'error', 'top-center')
      reset()
    }
  })

  const onConfirmDelete = () => {
    if (user) {
      const { userEmail, userToken } = user
      deleteDataset({
        variables: {
          id: dataset.id
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
        title={format('app.deletingEntity', { entity: dataset.name })}
        message={format('dataset.delete.confirm.message')}
        isOpen={displayConfirmDialog}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
  )
}

export default DeleteDataset
