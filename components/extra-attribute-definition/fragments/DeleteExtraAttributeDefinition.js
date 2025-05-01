import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { ToastContext } from '../../../lib/ToastContext'
import ConfirmActionDialog from '../../shared/form/ConfirmActionDialog'
import DeleteButton from '../../shared/form/DeleteButton'
import { DELETE_EXTRA_ATTRIBUTE_DEFINITION } from '../../shared/mutation/extraAttributeDefinition'
import {
  EXTRA_ATTRIBUTE_DEFINITION_DETAIL_QUERY,
  PAGINATED_EXTRA_ATTRIBUTE_DEFINITIONS_QUERY
} from '../../shared/query/extraAttributeDefinition'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'

const DeleteExtraAttributeDefinition = ({ extraAttributeDefinition }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false)
  const toggleConfirmDialog = () => setDisplayConfirmDialog(!displayConfirmDialog)

  const [deleteExtraAttributeDefinition, { called, reset }] = useMutation(DELETE_EXTRA_ATTRIBUTE_DEFINITION, {
    refetchQueries: [{
      query: EXTRA_ATTRIBUTE_DEFINITION_DETAIL_QUERY,
      variables: { slug: extraAttributeDefinition.slug },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
    }, {
      query: PAGINATED_EXTRA_ATTRIBUTE_DEFINITIONS_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
    }],
    onCompleted: (data) => {
      const { deleteExtraAttributeDefinition: response } = data
      if (response?.extraAttributeDefinition && response?.errors?.length === 0) {
        setDisplayConfirmDialog(false)
        showSuccessMessage(
          format('toast.delete.success', { entity: format('ui.extraAttributeDefinition.label') }),
          () => router.push(`/${locale}/extra-attribute-definitions`)
        )
      } else {
        setDisplayConfirmDialog(false)
        showFailureMessage(format('toast.delete.failure', { entity: format('ui.extraAttributeDefinition.label') }))
        reset()
      }
    },
    onError: () => {
      setDisplayConfirmDialog(false)
      showFailureMessage(format('toast.delete.failure', { entity: format('ui.extraAttributeDefinition.label') }))
      reset()
    }
  })

  const onConfirmDelete = () => {
    deleteExtraAttributeDefinition({
      variables: {
        id: extraAttributeDefinition.id
      },
      context: {
        headers: {
          'Accept-Language': locale
        }
      }
    })
  }

  return (
    <>
      <DeleteButton type='button' onClick={toggleConfirmDialog} />
      <ConfirmActionDialog
        title={format('app.deletingEntity', { entity: extraAttributeDefinition.name })}
        message={format('delete.confirm.message', { entity: format('ui.extraAttributeDefinition.label') })}
        isOpen={displayConfirmDialog}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
  )
}

export default DeleteExtraAttributeDefinition
