import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useUser } from '../../lib/hooks'
import { ToastContext } from '../../lib/ToastContext'
import ConfirmActionDialog from '../shared/ConfirmActionDialog'
import DeleteButton from '../shared/DeleteButton'
import { PLAYBOOK_PLAYS_QUERY, PLAYBOOK_QUERY } from '../../queries/playbook'
import { UNASSIGN_PLAYBOOK_PLAY } from '../../mutations/playbook'

const UnassignPlay = ({ playbookSlug, playSlug }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false)

  const router = useRouter()
  const { locale } = router

  const { user } = useUser()

  const { showToast } = useContext(ToastContext)

  const [deletePlaybookPlay, { called, reset }] = useMutation(UNASSIGN_PLAYBOOK_PLAY, {
    refetchQueries: [{
      query: PLAYBOOK_PLAYS_QUERY,
      variables: { slug: playbookSlug }
    }, {
      query: PLAYBOOK_QUERY,
      variables: { slug: playbookSlug }
    }],
    onCompleted: (data) => {
      const { deletePlaybookPlay: response } = data
      if (response?.playbook && response?.errors?.length === 0) {
        showToast(
          format('toast.playbook.unassign.success'),
          'success',
          'top-center'
        )
        setDisplayConfirmDialog(false)
      } else {
        showToast(format('toast.playbook.unassign.failure'), 'error', 'top-center')
        setDisplayConfirmDialog(false)
        reset()
      }
    },
    onError: () => {
      showToast(format('toast.playbook.unassign.failure'), 'error', 'top-center')
      setDisplayConfirmDialog(false)
      reset()
    }
  })

  const onConfirmDelete = () => {
    if (user && (user.isAdminUser || user.isEditorUser)) {
      const { userEmail, userToken } = user

      deletePlaybookPlay({
        variables: { playSlug, playbookSlug },
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
