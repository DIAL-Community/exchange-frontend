import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useMutation, useQuery } from '@apollo/client'
import { DELETING_POLICY_SLUG, GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { ToastContext } from '../../../lib/ToastContext'
import ConfirmActionDialog from '../../shared/form/ConfirmActionDialog'
import DeleteButton from '../../shared/form/DeleteButton'
import { DELETE_DATASET } from '../../shared/mutation/dataset'
import { DATASET_DETAIL_QUERY, PAGINATED_DATASETS_QUERY } from '../../shared/query/dataset'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'

const DeleteDataset = ({ dataset }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false)
  const toggleConfirmDialog = () => setDisplayConfirmDialog(!displayConfirmDialog)

  const [deleteDataset, { called, reset }] = useMutation(DELETE_DATASET, {
    refetchQueries: [{
      query: DATASET_DETAIL_QUERY,
      variables: { slug: dataset.slug }
    }, {
      query: PAGINATED_DATASETS_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 }
    }],
    onCompleted: (data) => {
      const { deleteDataset: response } = data
      if (response?.dataset && response?.errors?.length === 0) {
        setDisplayConfirmDialog(false)
        showSuccessMessage(
          format('toast.delete.success', { entity: format('ui.dataset.label') }),
          () => router.push(`/${locale}/datasets`)
        )
      } else {
        setDisplayConfirmDialog(false)
        showFailureMessage(format('toast.delete.failure', { entity: format('ui.dataset.label') }))
        reset()
      }
    },
    onError: () => {
      setDisplayConfirmDialog(false)
      showFailureMessage(format('toast.delete.failure', { entity: format('ui.dataset.label') }))
      reset()
    }
  })

  const onConfirmDelete = () => {
    deleteDataset({
      variables: {
        id: dataset.id
      },
      context: {
        headers: {
          'Accept-Language': locale
        }
      }
    })
  }

  const { error } = useQuery(DATASET_DETAIL_QUERY, {
    variables: { slug: DELETING_POLICY_SLUG },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.DELETING
      }
    }
  })

  return error &&
    <>
      <DeleteButton type='button' onClick={toggleConfirmDialog} />
      <ConfirmActionDialog
        title={format('app.deletingEntity', { entity: dataset.name })}
        message={format('delete.confirm.message', { entity: format('ui.dataset.label') })}
        isOpen={displayConfirmDialog}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
}

export default DeleteDataset
