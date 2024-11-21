import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import ConfirmActionDialog from '../../shared/form/ConfirmActionDialog'
import DeleteButton from '../../shared/form/DeleteButton'
import { UNASSIGN_PLAYBOOK_PLAY } from '../../shared/mutation/playbook'
import { PLAYBOOK_DETAIL_QUERY } from '../../shared/query/playbook'

const UnassignPlay = ({ playbookSlug, playSlug }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false)

  const router = useRouter()
  const { locale } = router

  const { user } = useUser()
  const { showFailureMessage, showSuccessMessage } = useContext(ToastContext)

  const [deletePlaybookPlay, { called, reset }] = useMutation(UNASSIGN_PLAYBOOK_PLAY, {
    refetchQueries: [{
      query: PLAYBOOK_DETAIL_QUERY,
      variables: { slug: playbookSlug, owner: 'public' },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
    }],
    onCompleted: (data) => {
      const { deletePlaybookPlay: response } = data
      if (response?.playbook && response?.errors?.length === 0) {
        showSuccessMessage(format('toast.playbook.unassign.success'))
        setDisplayConfirmDialog(false)
      } else {
        showFailureMessage(format('toast.playbook.unassign.failure'))
        setDisplayConfirmDialog(false)
        reset()
      }
    },
    onError: () => {
      showFailureMessage(format('toast.playbook.unassign.failure'))
      setDisplayConfirmDialog(false)
      reset()
    }
  })

  const onConfirmDelete = () => {
    if (user?.isAdliAdminUser || user?.isAdminUser || user?.isEditorUser) {
      deletePlaybookPlay({
        variables: {
          playSlug,
          playbookSlug,
          owner: 'public'
        },
        context: {
          headers: {
            'Accept-Language': locale
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
      <DeleteButton title='ui.play.unassign' type='button' onClick={toggleConfirmDialog} />
      <ConfirmActionDialog
        title={format('ui.play.unassign.title')}
        message={format('ui.play.unassign.confirmation')}
        isOpen={displayConfirmDialog}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
  )
}

export default UnassignPlay
