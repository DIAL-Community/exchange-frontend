import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useMutation, useQuery } from '@apollo/client'
import { DELETING_POLICY_SLUG, GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { ToastContext } from '../../../lib/ToastContext'
import ConfirmActionDialog from '../../shared/form/ConfirmActionDialog'
import DeleteButton from '../../shared/form/DeleteButton'
import { DELETE_SITE_SETTING } from '../../shared/mutation/siteSetting'
import {
  PAGINATED_SITE_SETTINGS_QUERY, SITE_SETTING_DETAIL_QUERY, SITE_SETTING_POLICY_QUERY
} from '../../shared/query/siteSetting'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'

const DeleteSiteSetting = ({ siteSetting }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false)
  const toggleConfirmDialog = () => setDisplayConfirmDialog(!displayConfirmDialog)

  const [deleteSiteSetting, { called, reset }] = useMutation(DELETE_SITE_SETTING, {
    refetchQueries: [{
      query: SITE_SETTING_DETAIL_QUERY,
      variables: { slug: siteSetting.slug }
    }, {
      query: PAGINATED_SITE_SETTINGS_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 }
    }],
    onCompleted: (data) => {
      const { deleteSiteSetting: response } = data
      if (response?.siteSetting && response?.errors?.length === 0) {
        setDisplayConfirmDialog(false)
        showSuccessMessage(
          format('toast.delete.success', { entity: format('ui.siteSetting.label') }),
          () => router.push('/admin/site-settings')
        )
      } else {
        setDisplayConfirmDialog(false)
        showFailureMessage(format('toast.delete.failure', { entity: format('ui.siteSetting.label') }))
        reset()
      }
    },
    onError: () => {
      setDisplayConfirmDialog(false)
      showFailureMessage(format('toast.delete.failure', { entity: format('ui.siteSetting.label') }))
      reset()
    }
  })

  const onConfirmDelete = () => {
    deleteSiteSetting({
      variables: {
        id: siteSetting.id
      },
      context: {
        headers: {
          'Accept-Language': locale
        }
      }
    })
  }

  const { error } = useQuery(SITE_SETTING_POLICY_QUERY, {
    variables: { tenantName: DELETING_POLICY_SLUG },
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
        title={format('app.deletingEntity', { entity: siteSetting.name })}
        message={format('delete.confirm.message', { entity: format('ui.siteSetting.label') })}
        isOpen={displayConfirmDialog}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
  )
}

export default DeleteSiteSetting
