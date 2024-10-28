import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { ToastContext } from '../../../lib/ToastContext'
import ConfirmActionDialog from '../../shared/form/ConfirmActionDialog'
import DeleteButton from '../../shared/form/DeleteButton'
import { DELETE_CANDIDATE_STATUS } from '../../shared/mutation/candidateStatus'
import { CANDIDATE_STATUS_DETAIL_QUERY, PAGINATED_CANDIDATE_STATUSES_QUERY } from '../../shared/query/candidateStatus'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'

const DeleteCandidateStatus = ({ candidateStatus }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false)
  const toggleConfirmDialog = () => setDisplayConfirmDialog(!displayConfirmDialog)

  const [deleteCandidateStatus, { called, reset }] = useMutation(DELETE_CANDIDATE_STATUS, {
    refetchQueries: [{
      query: CANDIDATE_STATUS_DETAIL_QUERY,
      variables: { slug: candidateStatus.slug }
    }, {
      query: PAGINATED_CANDIDATE_STATUSES_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 }
    }],
    onCompleted: (data) => {
      const { deleteCandidateStatus: response } = data
      if (response?.candidateStatus && response?.errors?.length === 0) {
        setDisplayConfirmDialog(false)
        showSuccessMessage(
          format('toast.delete.success', { entity: format('ui.candidateStatus.label') }),
          () => router.push(`/${locale}/candidate-statuses`)
        )
      } else {
        setDisplayConfirmDialog(false)
        showFailureMessage(format('toast.delete.failure', { entity: format('ui.candidateStatus.label') }))
        reset()
      }
    },
    onError: () => {
      setDisplayConfirmDialog(false)
      showFailureMessage(format('toast.delete.failure', { entity: format('ui.candidateStatus.label') }))
      reset()
    }
  })

  const onConfirmDelete = () => {
    deleteCandidateStatus({
      variables: {
        id: candidateStatus.id
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
        title={format('app.deletingEntity', { entity: candidateStatus.name })}
        message={format('delete.confirm.message', { entity: format('ui.candidateStatus.label') })}
        isOpen={displayConfirmDialog}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
  )
}

export default DeleteCandidateStatus
