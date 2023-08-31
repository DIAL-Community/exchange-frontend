import { useIntl } from 'react-intl'
import { useCallback, useContext, useState } from 'react'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import DeleteButton from '../shared/DeleteButton'
import ConfirmActionDialog from '../shared/ConfirmActionDialog'
import { DEFAULT_AUTO_CLOSE_DELAY, ToastContext } from '../../lib/ToastContext'
import { DELETE_BUILDING_BLOCK } from '../../mutations/building-block'
import { useUser } from '../../lib/hooks'
import { BUILDING_BLOCK_DETAIL_QUERY } from '../../queries/building-block'

const DeleteBuildingBlock = ({ buildingBlock }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showToast } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const { user } = useUser()

  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false)
  const toggleConfirmDialog = () => setDisplayConfirmDialog(!displayConfirmDialog)

  const [deleteBuildingBlock, { called, reset }] = useMutation(DELETE_BUILDING_BLOCK, {
    refetchQueries: [{
      query: BUILDING_BLOCK_DETAIL_QUERY,
      variables: { slug: buildingBlock.slug }
    }],
    onCompleted: (data) => {
      const { deleteBuildingBlock: response } = data
      if (response?.buildingBlock && response?.errors?.length === 0) {
        setDisplayConfirmDialog(false)
        showToast(
          format('toast.building-block.delete.success'),
          'success',
          'top-center',
          DEFAULT_AUTO_CLOSE_DELAY,
          null,
          () => router.push('/building_blocks')
        )
      } else {
        setDisplayConfirmDialog(false)
        showToast(format('toast.building-block.delete.failure'), 'error', 'top-center')
        reset()
      }
    },
    onError: () => {
      setDisplayConfirmDialog(false)
      showToast(format('toast.building-block.delete.failure'), 'error', 'top-center')
      reset()
    }
  })

  const onConfirmDelete = () => {
    if (user) {
      const { userEmail, userToken } = user
      deleteBuildingBlock({
        variables: {
          id: buildingBlock.id
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

  return (
    <>
      <DeleteButton type='button' onClick={toggleConfirmDialog} />
      <ConfirmActionDialog
        title={format('app.deletingEntity', { entity: buildingBlock.name })}
        message={format('buildingBlock.delete.confirm.message')}
        isOpen={displayConfirmDialog}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
  )
}

export default DeleteBuildingBlock
