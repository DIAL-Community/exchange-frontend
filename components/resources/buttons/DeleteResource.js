import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useMutation, useQuery } from '@apollo/client'
import { DELETING_POLICY_SLUG, GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { ToastContext } from '../../../lib/ToastContext'
import ConfirmActionDialog from '../../shared/form/ConfirmActionDialog'
import DeleteButton from '../../shared/form/DeleteButton'
import { DELETE_RESOURCE } from '../../shared/mutation/resource'
import { PAGINATED_RESOURCES_QUERY, RESOURCE_DETAIL_QUERY, RESOURCE_POLICY_QUERY } from '../../shared/query/resource'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'

const DeleteResource = ({ resource }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false)
  const toggleConfirmDialog = () => setDisplayConfirmDialog(!displayConfirmDialog)

  const [deleteResource, { called, reset }] = useMutation(DELETE_RESOURCE, {
    refetchQueries: [{
      query: RESOURCE_DETAIL_QUERY,
      variables: { slug: resource.slug }
    }, {
      query: PAGINATED_RESOURCES_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 }
    }],
    onCompleted: (data) => {
      const { deleteResource: response } = data
      if (response?.resource && response?.errors?.length === 0) {
        setDisplayConfirmDialog(false)
        showSuccessMessage(
          format('toast.delete.success', { entity: format('ui.resource.label') }),
          () => router.push(`/${locale}/resources`)
        )
      } else {
        setDisplayConfirmDialog(false)
        showFailureMessage(format('toast.delete.failure', { entity: format('ui.resource.label') }))
        reset()
      }
    },
    onError: () => {
      setDisplayConfirmDialog(false)
      showFailureMessage(format('toast.delete.failure', { entity: format('ui.resource.label') }))
      reset()
    }
  })

  const onConfirmDelete = () => {
    deleteResource({
      variables: {
        id: resource.id
      },
      context: {
        headers: {
          'Accept-Language': locale
        }
      }
    })
  }

  const { error } = useQuery(RESOURCE_POLICY_QUERY, {
    variables: { slug: DELETING_POLICY_SLUG },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.DELETING
      }
    }
  })

  return !error && (
    <>
      <DeleteButton type='button' onClick={toggleConfirmDialog} />
      <ConfirmActionDialog
        title={format('app.deletingEntity', { entity: resource.name })}
        message={format('delete.confirm.message', { entity: format('ui.resource.label') })}
        isOpen={displayConfirmDialog}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
  )
}

export default DeleteResource
