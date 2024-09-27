import { useEffect, useState } from 'react'
import { FaArrowDown, FaArrowUp, FaMinus, FaPencil, FaPlus, FaXmark } from 'react-icons/fa6'
import { FormattedMessage } from 'react-intl'
import { useUser } from '../../../lib/hooks'
import { generateMenuHeaderText } from '../utilities'
import DeleteMenuConfiguration from './DeleteMenuConfiguration'
import MenuConfigurationEditor from './MenuConfigurationEditor'
import MenuConfigurationViewer from './MenuConfigurationViewer'

const MenuConfiguration = (props) => {
  // Only menu item will have the following properties
  const { appendMenuItem } = props
  // Common properties coming from the parent component.
  const { siteSettingSlug, menuConfiguration, parentMenuConfiguration } = props
  const { menuConfigurations, setMenuConfigurations } = props

  const [editing, setEditing] = useState('saved' in menuConfiguration)
  const [expanded, setExpanded] = useState('saved' in menuConfiguration)

  const [modified, setModified] = useState('saved' in menuConfiguration)

  const toggleEditing = () => {
    if (!editing) {
      setExpanded(true)
    }

    setEditing(!editing)
  }

  useEffect(() => {
    if (typeof menuConfiguration.saved === 'undefined') {
      setModified(false)
    }
  }, [menuConfiguration])

  const toggleExpanded = () => setExpanded(!expanded)

  const { user } = useUser()
  const allowedToEdit = () => user?.isAdminUser || user?.isEditorUser
  const editable = () => ['menu', 'menu.item', 'separator'].indexOf(menuConfiguration.type) >= 0

  const moveMenuConfiguration = (direction) => {
    // Find the index of the current menu configuration.
    const currentMenuConfigurations = [...menuConfigurations]

    // Index of the current configuration. This could be parent menu or menu item.
    let currentIndex = -1

    currentIndex = currentMenuConfigurations.findIndex(m => m.id === menuConfiguration.id)
    if (currentIndex >= 0) {
      const updatedIndex = currentIndex + direction
      // Only swapping if the updated index is within the range.
      if (updatedIndex >= 0 && updatedIndex <= currentMenuConfigurations.length) {
        const currentMenuConfiguration = currentMenuConfigurations[currentIndex]
        // Swap the current menu configuration with the updated index.
        currentMenuConfigurations[currentIndex] = currentMenuConfigurations[updatedIndex]
        currentMenuConfigurations[updatedIndex] = currentMenuConfiguration
      }
    } else {
      currentIndex = currentMenuConfigurations.findIndex(m => m.id === parentMenuConfiguration.id)
      const currentParentMenuConfiguration = currentMenuConfigurations[currentIndex]
      const currentMenuItemConfigurations = [...currentParentMenuConfiguration.menuItemConfigurations]
      // Find the index of the current menu configuration in the array item configurations.
      const currentChildIndex = currentMenuItemConfigurations.findIndex(m => m.id === menuConfiguration.id)
      const updatedChildIndex = currentChildIndex + direction
      // Only swapping if the updated index is within the range.
      if (updatedChildIndex >= 0 && updatedChildIndex <= currentMenuItemConfigurations.length) {
        const currentMenuItemConfiguration = currentMenuItemConfigurations[currentChildIndex]
        // Swap the current menu item configuration with the updated index.
        currentMenuItemConfigurations[currentChildIndex] = currentMenuItemConfigurations[updatedChildIndex]
        currentMenuItemConfigurations[updatedChildIndex] = currentMenuItemConfiguration
      }

      // Rebuild the parent menu configuration with the updated menu item configurations.
      currentMenuConfigurations[currentIndex] = {
        ...currentParentMenuConfiguration,
        menuItemConfigurations: currentMenuItemConfigurations
      }
    }

    setMenuConfigurations(currentMenuConfigurations)
  }

  return (
    <div className='flex flex-col'>
      <div className='collapse-header'>
        <div className='collapse-animation-base bg-dial-blue-chalk h-14' />
        <div className='flex flex-row flex-wrap gap-3 collapse-header'>
          <div className='my-auto cursor-pointer flex-grow' onClick={toggleExpanded}>
            <div className='font-semibold px-4 py-4 flex gap-1'>
              <FormattedMessage
                id={menuConfiguration.name}
                defaultMessage={menuConfiguration.name}
              />
              <span className='text-xs font-normal my-auto'>
                ({generateMenuHeaderText(menuConfiguration)})
              </span>
              {modified && <span className='text-sm text-dial-stratos'>*</span>}
            </div>
          </div>
          <div className='ml-auto my-auto px-4'>
            <div className='flex gap-2'>
              {allowedToEdit() && editable() && appendMenuItem &&
                <button
                  type='button'
                  className='bg-white px-2 py-1 rounded'
                  onClick={() => appendMenuItem(menuConfiguration.id)}
                >
                  <div className='text-sm flex gap-1 text-dial-stratos'>
                    <FormattedMessage id='ui.siteSetting.menu.appendMenuItem' />
                    <FaPlus className='my-auto' />
                  </div>
                </button>
              }
              {allowedToEdit() && editable() &&
                <button
                  type='button'
                  onClick={toggleEditing}
                  className='bg-white px-2 py-1 rounded'
                >
                  <div className='text-sm flex gap-1 text-dial-stratos'>
                    {!editing ? <FaPencil className='my-auto' /> : <FaXmark className='my-auto' />}
                    {!editing ? <FormattedMessage id='app.modify' /> : <FormattedMessage id='app.cancel' />}
                  </div>
                </button>
              }
              {allowedToEdit() && editable() &&
                <DeleteMenuConfiguration
                  siteSettingSlug={siteSettingSlug}
                  menuConfiguration={menuConfiguration}
                  menuConfigurations={menuConfigurations}
                  setMenuConfigurations={setMenuConfigurations}
                />
              }
              {allowedToEdit() &&
                <div className='flex gap-1'>
                  <button
                    type='button'
                    onClick={() => moveMenuConfiguration(-1)}
                    className='cursor-pointer bg-white px-2 py-1 rounded'
                  >
                    <FaArrowUp className='my-auto text-dial-stratos' />
                  </button>
                  <button
                    type='button'
                    onClick={() => moveMenuConfiguration(1)}
                    className='cursor-pointer bg-white px-2 py-1 rounded'
                  >
                    <FaArrowDown className='my-auto text-dial-stratos' />
                  </button>
                </div>
              }
              <button
                type='button'
                onClick={toggleExpanded}
                className='cursor-pointer bg-white px-2 py-1 rounded'
              >
                {expanded
                  ? <FaMinus className='my-auto text-dial-stratos' />
                  : <FaPlus className='my-auto text-dial-stratos' />
                }
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={`${expanded ? 'slide-down' : 'slide-up'} border`}>
        {editing
          ? <MenuConfigurationEditor
            siteSettingSlug={siteSettingSlug}
            menuConfiguration={menuConfiguration}
            parentMenuConfiguration={parentMenuConfiguration}
            menuConfigurations={menuConfigurations}
            setMenuConfigurations={setMenuConfigurations}
          />
          : <MenuConfigurationViewer menuConfiguration={menuConfiguration} />
        }
      </div>
    </div>
  )
}

export default MenuConfiguration
