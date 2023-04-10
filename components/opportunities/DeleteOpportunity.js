import { useMutation } from '@apollo/client'
import router, { useRouter } from 'next/router'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useUser } from '../../lib/hooks'
import { DEFAULT_AUTO_CLOSE_DELAY, ToastContext } from '../../lib/ToastContext'
import { DELETE_OPPORTUNITY } from '../../mutations/opportunity'
import { OPPORTUNITY_QUERY } from '../../queries/opportunity'
import ConfirmActionDialog from '../shared/ConfirmActionDialog'
import DeleteButton from '../shared/DeleteButton'

const DeleteOpportunity = ({ opportunity }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false)

  const { locale } = useRouter()

  const { user } = useUser()

  const { showToast } = useContext(ToastContext)

  const [deleteOpportunity, { called, reset }] = useMutation(DELETE_OPPORTUNITY, {
    refetchQueries: [{
      query: OPPORTUNITY_QUERY,
      variables: { slug: opportunity.slug }
    }],
    onCompleted: (data) => {
      const { deleteOpportunity: response } = data
      if (response?.opportunity && response?.errors?.length === 0) {
        showToast(
          format('toast.opportunity.delete.success'),
          'success',
          'top-center',
          DEFAULT_AUTO_CLOSE_DELAY,
          null,
          () => router.push(`/${router.locale}/opportunities`)
        )
        setDisplayConfirmDialog(false)
      } else {
        showToast(format('toast.opportunity.delete.failure'), 'error', 'top-center')
        setDisplayConfirmDialog(false)
        reset()
      }
    },
    onError: () => {
      showToast(format('toast.opportunity.delete.failure'), 'error', 'top-center')
      setDisplayConfirmDialog(false)
      reset()
    }
  })

  const onConfirmDelete = () => {
    if (user) {
      const { userEmail, userToken } = user

      deleteOpportunity({
        variables: {
          id: opportunity.id
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

  const toggleConfirmDialog = () => {
    setDisplayConfirmDialog(!displayConfirmDialog)
  }

  return (
    <>
      <DeleteButton type='button' onClick={toggleConfirmDialog} />
      <ConfirmActionDialog
        title={format('app.deleting-entity', { entity: opportunity.name })}
        message={format('opportunity.delete.confirm.message')}
        isOpen={displayConfirmDialog}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
  )
}

export default DeleteOpportunity
