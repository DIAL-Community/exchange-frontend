import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useCallback, useContext, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { FaRegTrashAlt } from 'react-icons/fa'
import { useUser } from '../../lib/hooks'
import { ToastContext } from '../../lib/ToastContext'
import { UNASSIGN_PLAY_MOVE } from '../shared/mutation/move'
import { PLAYBOOK_DETAIL_QUERY } from '../shared/query/playbook'
import ConfirmActionDialog from '../shared/form/ConfirmActionDialog'

const UnassignMove = ({ playbookSlug, playSlug, moveSlug }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false)

  const router = useRouter()
  const { locale } = router

  const { user } = useUser()

  const { showToast } = useContext(ToastContext)

  const [deletePlayMove, { called, reset }] = useMutation(UNASSIGN_PLAY_MOVE, {
    refetchQueries: [{
      query: PLAYBOOK_DETAIL_QUERY,
      variables: { slug: playbookSlug }
    }],
    onCompleted: (data) => {
      const { deletePlayMove: response } = data
      if (response?.play && response?.errors?.length === 0) {
        showToast(format('toast.play.unassign.success'), 'success', 'top-center')
        setDisplayConfirmDialog(false)
      } else {
        showToast(format('toast.play.unassign.failure'), 'error', 'top-center')
        setDisplayConfirmDialog(false)
        reset()
      }
    },
    onError: () => {
      showToast(format('toast.play.unassign.failure'), 'error', 'top-center')
      setDisplayConfirmDialog(false)
      reset()
    }
  })

  const onConfirmDelete = () => {
    if (user && (user.isAdminUser || user.isEditorUser)) {
      const { userEmail, userToken } = user

      deletePlayMove({
        variables: { moveSlug, playSlug },
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
      <button
        type='button'
        onClick={toggleConfirmDialog}
        className='cursor-pointer bg-white px-2 py-0.5 rounded'
      >
        <FaRegTrashAlt className='inline pb-0.5 text-red-500'/>
        <span className='text-sm px-1 text-red-500'>
          <FormattedMessage id='ui.move.unassign' />
        </span>
      </button>
      <ConfirmActionDialog
        title={format('ui.move.unassign.title')}
        message={format('ui.move.unassign.confirmation')}
        isOpen={displayConfirmDialog}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
  )
}

export default UnassignMove
