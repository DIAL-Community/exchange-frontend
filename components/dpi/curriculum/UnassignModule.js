import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import ConfirmActionDialog from '../../shared/form/ConfirmActionDialog'
import DeleteButton from '../../shared/form/DeleteButton'
import { UNASSIGN_PLAYBOOK_PLAY } from '../../shared/mutation/playbook'
import { PLAYBOOK_DETAIL_QUERY } from '../../shared/query/play'

const UnassignModule = ({ curriculumSlug, moduleSlug }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false)

  const router = useRouter()
  const { locale } = router

  const { user } = useUser()

  const { showToast } = useContext(ToastContext)

  const [deleteCurriculumModule, { called, reset }] = useMutation(UNASSIGN_PLAYBOOK_PLAY, {
    refetchQueries: [{
      query: PLAYBOOK_DETAIL_QUERY,
      variables: { slug: curriculumSlug }
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
    if (user?.isAdliAdminUser || user?.isAdminUser || user?.isEditorUser) {
      const { userEmail, userToken } = user

      deleteCurriculumModule({
        variables: {
          playSlug: moduleSlug,
          playbookSlug: curriculumSlug
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
      <DeleteButton title='ui.play.unassign' type='button' onClick={toggleConfirmDialog} />
      <ConfirmActionDialog
        title={format('dpi.curriculum.module.unassign')}
        message={format('dpi.curriculum.module.unassign.confirmation')}
        isOpen={displayConfirmDialog}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
  )
}

export default UnassignModule
