import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import ConfirmActionDialog from '../../shared/form/ConfirmActionDialog'
import DeleteButton from '../../shared/form/DeleteButton'
import { DELETE_PLAYBOOK } from '../../shared/mutation/playbook'
import { PLAYBOOK_DETAIL_QUERY } from '../../shared/query/play'
import { DPI_TENANT_NAME } from '../constants'

const DeleteCurriculum = ({ curriculum }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showFailureMessage, showSuccessMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const { user } = useUser()
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)

  const toggleConfirmDialog = () => {
    setIsConfirmDialogOpen(!isConfirmDialogOpen)
  }

  const [deleteCurriculum, { called, reset }] = useMutation(DELETE_PLAYBOOK, {
    refetchQueries: [{
      query: PLAYBOOK_DETAIL_QUERY,
      variables: { slug: curriculum.slug, owner: DPI_TENANT_NAME },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
    }],
    onCompleted: (data) => {
      const { deleteCurriculum: response } = data
      if (response?.curriculum && response?.errors?.length === 0) {
        showSuccessMessage(
          format('toast.delete.success', { entity: format('hub.curriculum.label') }),
          () => router.push('/hub/curriculum')
        )
        setIsConfirmDialogOpen(false)
      } else {
        showFailureMessage(format('toast.delete.failure', { entity: format('hub.curriculum.label') }))
        setIsConfirmDialogOpen(false)
        reset()
      }
    },
    onError: () => {
      showFailureMessage(format('toast.delete.failure', { entity: format('hub.curriculum.label') }))
      setIsConfirmDialogOpen(false)
      reset()
    }
  })

  const onConfirmDelete = () => {
    if (user) {
      deleteCurriculum({
        variables: {
          id: curriculum.id
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
      <DeleteButton type='button' onClick={toggleConfirmDialog}/>
      <ConfirmActionDialog
        title={format('app.deletingEntity', { entity: curriculum.name })}
        message={format('hub.curriculum.delete.confirm.message')}
        isOpen={isConfirmDialogOpen}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
  )
}

export default DeleteCurriculum
