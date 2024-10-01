import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { useUser } from '../../lib/hooks'
import { ToastContext } from '../../lib/ToastContext'
import ConfirmActionDialog from '../shared/form/ConfirmActionDialog'
import DeleteButton from '../shared/form/DeleteButton'
import { DELETE_TENANT_SETTING } from '../shared/mutation/tenantSetting'
import { TENANT_SETTINGS_QUERY } from '../shared/query/tenantSetting'

const DeleteTenantSetting = ({ tenantSetting }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const { user } = useUser()

  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false)
  const toggleConfirmDialog = () => setDisplayConfirmDialog(!displayConfirmDialog)

  const [deleteTenantSetting, { called, reset }] = useMutation(DELETE_TENANT_SETTING, {
    refetchQueries: [{
      query: TENANT_SETTINGS_QUERY,
      variables: {}
    }],
    onCompleted: (data) => {
      const { deleteTenantSetting: response } = data
      if (response?.tenantSetting && response?.errors?.length === 0) {
        setDisplayConfirmDialog(false)
        showSuccessMessage(
          format('toast.delete.success', { entity: format('ui.tenantSetting.label') }),
          () => router.push('/admin/tenant-settings')
        )
      } else {
        setDisplayConfirmDialog(false)
        showFailureMessage(format('toast.delete.failure', { entity: format('ui.tenantSetting.label') }))
        reset()
      }
    },
    onError: () => {
      setDisplayConfirmDialog(false)
      showFailureMessage(format('toast.delete.failure', { entity: format('ui.tenantSetting.label') }))
      reset()
    }
  })

  const onConfirmDelete = () => {
    if (user) {
      const { userEmail, userToken } = user
      deleteTenantSetting({
        variables: {
          tenantName: tenantSetting.tenantName
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
        title={format('app.deletingEntity', { entity: tenantSetting.name })}
        message={format('delete.confirm.message', { entity: format('ui.tenantSetting.label') })}
        isOpen={displayConfirmDialog}
        onClose={toggleConfirmDialog}
        onConfirm={onConfirmDelete}
        isConfirming={called} />
    </>
  )
}

export default DeleteTenantSetting
