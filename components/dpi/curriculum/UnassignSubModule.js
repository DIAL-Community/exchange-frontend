import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { FaRegTrashAlt } from 'react-icons/fa'
import { FormattedMessage, useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import ConfirmActionDialog from '../../shared/form/ConfirmActionDialog'
import { UNASSIGN_PLAY_MOVE } from '../../shared/mutation/move'
import { PLAYBOOK_DETAIL_QUERY } from '../../shared/query/playbook'
import { DPI_TENANT_NAME } from '../constants'

const UnassignSubModule = ({ curriculumSlug, moduleSlug, subModuleSlug }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false)

  const router = useRouter()
  const { locale } = router

  const { user } = useUser()

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const [deleteSubmodule, { called, reset }] = useMutation(UNASSIGN_PLAY_MOVE, {
    refetchQueries: [{
      query: PLAYBOOK_DETAIL_QUERY,
      variables: { slug: curriculumSlug, owner: DPI_TENANT_NAME }
    }],
    onCompleted: (data) => {
      const { deletePlayMove: response } = data
      if (response?.play && response?.errors?.length === 0) {
        showSuccessMessage(format('toast.module.unassign.success'))
        setDisplayConfirmDialog(false)
      } else {
        showFailureMessage(format('toast.module.unassign.failure'))
        setDisplayConfirmDialog(false)
        reset()
      }
    },
    onError: () => {
      showFailureMessage(format('toast.module.unassign.failure'))
      setDisplayConfirmDialog(false)
      reset()
    }
  })

  const onConfirmDelete = () => {
    if (user?.isAdliAdminUser || user?.isAdminUser || user?.isEditorUser) {
      const { userEmail, userToken } = user

      deleteSubmodule({
        variables: {
          playSlug: moduleSlug,
          moveSlug: subModuleSlug,
          owner: DPI_TENANT_NAME
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
        title={format('dpi.curriculum.submodule.unassign.title')}
        message={format('dpi.curriculum.submodule.unassign.confirmation')}
        isOpen={displayConfirmDialog}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
  )
}

export default UnassignSubModule
