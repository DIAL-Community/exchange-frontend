import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { FaXmark } from 'react-icons/fa6'
import { FormattedMessage, useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { ToastContext } from '../../../lib/ToastContext'
import ConfirmActionDialog from '../../shared/form/ConfirmActionDialog'
import { UPDATE_SITE_SETTING_MENU_CONFIGURATIONS } from '../../shared/mutation/siteSetting'

const DeleteMenuConfiguration = (props) => {
  const { siteSettingSlug, menuConfiguration, menuConfigurations, setMenuConfigurations } = props

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false)
  const toggleConfirmDialog = () => setDisplayConfirmDialog(!displayConfirmDialog)

  const [mutating, setMutating] = useState(false)

  const { locale } = useRouter()
  const [bulkUpdateMenu, { reset }] = useMutation(UPDATE_SITE_SETTING_MENU_CONFIGURATIONS, {
    onError: (error) => {
      showFailureMessage(error?.message)
      setDisplayConfirmDialog(false)
      setMutating(false)
      reset()
    },
    onCompleted: (data) => {
      const { updateSiteSettingMenuConfigurations: response } = data
      if (response.errors.length === 0 && response.siteSetting) {
        showSuccessMessage(<FormattedMessage id='ui.siteSetting.menuConfigurations.submitted' />)
        setMenuConfigurations([...response.siteSetting.menuConfigurations])
        setDisplayConfirmDialog(false)
        setMutating(false)
      } else {
        const [ firstErrorMessage ] = response.errors
        showFailureMessage(firstErrorMessage)
        setDisplayConfirmDialog(false)
        setMutating(false)
        reset()
      }
    }
  })

  const executeBulkUpdate = () => {
    setMutating(true)
    const currentMenuConfigurations = [...menuConfigurations]
    // Try to find the index in the top level menu configurations
    let indexOfMenuConfiguration = menuConfigurations.findIndex(m => m.id === menuConfiguration.id)
    if (indexOfMenuConfiguration >= 0) {
      // Remove the menu configuration from the current menu configurations
      currentMenuConfigurations.splice(indexOfMenuConfiguration, 1)
    } else {
      // Try finding the id to be deleted in the menu item configurations
      indexOfMenuConfiguration = menuConfigurations.findIndex(m => {
        return m.menuItemConfigurations.findIndex(mi => mi.id === menuConfiguration.id) >= 0
      })
      const existingParentMenu = currentMenuConfigurations[indexOfMenuConfiguration]
      // Rebuild the parent menu configuration without the menu item configuration
      const currentParentMenu = {
        ...existingParentMenu,
        menuItemConfigurations: [
          ...existingParentMenu.menuItemConfigurations.filter(mi => mi.id !== menuConfiguration.id)
        ]
      }
      currentMenuConfigurations[indexOfMenuConfiguration] = currentParentMenu
    }

    const variables = {
      siteSettingSlug,
      menuConfigurations: currentMenuConfigurations
    }

    bulkUpdateMenu({
      variables,
      context: {
        headers: {
          'Accept-Language': locale
        }
      }
    })
  }

  const dialogTitle = menuConfiguration.type === 'menu'
    ? format('ui.siteSetting.menu.deleteMenu')
    : format('ui.siteSetting.menu.deleteMenuItem')

  const dialogDescription = menuConfiguration.type === 'menu'
    ? format('ui.siteSetting.menu.deleteMenuDescription')
    : format('ui.siteSetting.menu.deleteMenuItemDescription')

  return (
    <>
      <button
        type='button'
        onClick={toggleConfirmDialog}
        className='bg-white px-2 py-1 rounded'
      >
        <div className='text-sm flex gap-1 text-red-500'>
          <FaXmark className='my-auto' />
          <FormattedMessage id='app.delete' />
        </div>
      </button>
      <ConfirmActionDialog
        title={dialogTitle}
        message={dialogDescription}
        isOpen={displayConfirmDialog}
        onClose={toggleConfirmDialog}
        onConfirm={executeBulkUpdate}
        isConfirming={mutating}
      />
    </>
  )
}

export default DeleteMenuConfiguration
