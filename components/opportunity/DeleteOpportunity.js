import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { useUser } from '../../lib/hooks'
import { ToastContext } from '../../lib/ToastContext'
import ConfirmActionDialog from '../shared/form/ConfirmActionDialog'
import DeleteButton from '../shared/form/DeleteButton'
import { DELETE_OPPORTUNITY } from '../shared/mutation/opportunity'
import { OPPORTUNITY_DETAIL_QUERY, PAGINATED_OPPORTUNITIES_QUERY } from '../shared/query/opportunity'
import { DEFAULT_PAGE_SIZE } from '../utils/constants'

const DeleteOpportunity = ({ opportunity }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const { user } = useUser()

  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false)
  const toggleConfirmDialog = () => setDisplayConfirmDialog(!displayConfirmDialog)

  const [deleteOpportunity, { called, reset }] = useMutation(DELETE_OPPORTUNITY, {
    refetchQueries: [{
      query: OPPORTUNITY_DETAIL_QUERY,
      variables: { slug: opportunity.slug }
    }, {
      query: PAGINATED_OPPORTUNITIES_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 }
    }],
    onCompleted: (data) => {
      const { deleteOpportunity: response } = data
      if (response?.opportunity && response?.errors?.length === 0) {
        setDisplayConfirmDialog(false)
        showSuccessMessage(
          format('toast.delete.success', { entity: format('ui.opportunity.label') }),
          () => router.push(`/${locale}/opportunities`)
        )
      } else {
        setDisplayConfirmDialog(false)
        showFailureMessage(format('toast.delete.failure', { entity: format('ui.opportunity.label') }))
        reset()
      }
    },
    onError: () => {
      setDisplayConfirmDialog(false)
      showFailureMessage(format('toast.delete.failure', { entity: format('ui.opportunity.label') }))
      reset()
    }
  })

  const onConfirmDelete = () => {
    if (user) {
      deleteOpportunity({
        variables: {
          id: opportunity.id
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
        title={format('app.deletingEntity', { entity: opportunity.name })}
        message={format('delete.confirm.message', { entity: format('ui.opportunity.label') })}
        isOpen={displayConfirmDialog}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
  )
}

export default DeleteOpportunity
