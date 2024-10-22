import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useMutation, useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import ConfirmActionDialog from '../../shared/form/ConfirmActionDialog'
import DeleteButton from '../../shared/form/DeleteButton'
import { DELETE_BUILDING_BLOCK } from '../../shared/mutation/buildingBlock'
import { BUILDING_BLOCK_DETAIL_QUERY, PAGINATED_BUILDING_BLOCKS_QUERY } from '../../shared/query/buildingBlock'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'

const DeleteBuildingBlock = ({ buildingBlock }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

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
        showSuccessMessage(
          format('toast.delete.success', { entity: format('ui.buildingBlock.label') }),
          () => router.push(`/${locale}/building-blocks`)
        )
      } else {
        setDisplayConfirmDialog(false)
        showFailureMessage(format('toast.delete.failure', { entity: format('ui.buildingBlock.label') }))
        reset()
      }
    },
    onError: () => {
      setDisplayConfirmDialog(false)
      showFailureMessage(format('toast.delete.failure', { entity: format('ui.buildingBlock.label') }))
      reset()
    }
  })

  const onConfirmDelete = () => {
    if (user) {
      deleteBuildingBlock({
        variables: {
          id: buildingBlock.id
        },
        context: {
          headers: {
            'Accept-Language': locale
          }
        }
      })
    }
  }

  const { data } = useQuery(BUILDING_BLOCK_DETAIL_QUERY, {
    variables: { slug: buildingBlock.slug },
    fetchPolicy: 'network-only',
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.DELETING
      }
    }
  })

  return data &&
    <>
      <DeleteButton type='button' onClick={toggleConfirmDialog} />
      <ConfirmActionDialog
        title={format('app.deletingEntity', { entity: buildingBlock.name })}
        message={format('delete.confirm.message', { entity: format('ui.buildingBlock.label') })}
        isOpen={displayConfirmDialog}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
}

export default DeleteBuildingBlock
