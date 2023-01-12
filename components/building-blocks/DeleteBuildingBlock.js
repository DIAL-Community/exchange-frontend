import { useIntl } from 'react-intl'
import { useCallback, useContext, useState } from 'react'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import DeleteButton from '../shared/DeleteButton'
import ConfirmActionDialog from '../shared/ConfirmActionDialog'
import { DEFAULT_AUTO_CLOSE_DELAY, ToastContext } from '../../lib/ToastContext'
import { DELETE_BUILDING_BLOCK } from '../../mutations/building-block'
import { useUser } from '../../lib/hooks'

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
    onCompleted: () => {
      setDisplayConfirmDialog(false)
      showToast(
        format('toast.building-block.delete.success'),
        'success',
        'top-center',
        DEFAULT_AUTO_CLOSE_DELAY,
        null,
        () => router.push('/building_blocks')
      )
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
        update(cache, { data }) {
          if (data) {
            const identity = {
              id: data.buildingBlock.id,
              __typename: 'BuildingBlock'
            }
            const normalizedId = cache.identify(identity)
            cache.evict({ id: normalizedId })
            cache.gc()
          }
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
        title={format('app.deleting-entity', { entity: buildingBlock.name })}
        message={format('building-block.delete.confirm.message')}
        isOpen={displayConfirmDialog}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
  )
}

export default DeleteBuildingBlock
