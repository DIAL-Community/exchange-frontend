import { useIntl } from 'react-intl'
import { useCallback, useContext, useState } from 'react'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { DEFAULT_PAGE_SIZE, REBRAND_BASE_PATH } from '../utils/constants'
import { ToastContext } from '../../../lib/ToastContext'
import { useUser } from '../../../lib/hooks'
import { DELETE_BUILDING_BLOCK } from '../shared/mutation/buildingBlock'
import { PAGINATED_BUILDING_BLOCKS_QUERY, BUILDING_BLOCK_DETAIL_QUERY } from '../shared/query/buildingBlock'
import DeleteButton from '../shared/form/DeleteButton'
import ConfirmActionDialog from '../shared/form/ConfirmActionDialog'

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
    }, {
      query: PAGINATED_BUILDING_BLOCKS_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 }
    }],
    onCompleted: (data) => {
      const { deleteBuildingBlock: response } = data
      if (response?.buildingBlock && response?.errors?.length === 0) {
        setDisplayConfirmDialog(false)
        showToast(
          format('toast.buildingBlock.delete.success'),
          'success',
          'top-center',
          1000,
          null,
          () => router.push(`${REBRAND_BASE_PATH}/building-blocks`)
        )
      } else {
        setDisplayConfirmDialog(false)
        showToast(format('toast.buildingBlock.delete.failure'), 'error', 'top-center')
        reset()
      }
    },
    onError: () => {
      setDisplayConfirmDialog(false)
      showToast(format('toast.buildingBlock.delete.failure'), 'error', 'top-center')
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
