import { useEffect, useState } from 'react'
import { FaMinus, FaPencil, FaPlus, FaXmark } from 'react-icons/fa6'
import { FormattedMessage } from 'react-intl'
import { useUser } from '../../../lib/hooks'
import DeleteMenuConfiguration from './DeleteMenuConfiguration'
import MenuConfigurationEditor from './MenuConfigurationEditor'
import MenuConfigurationViewer from './MenuConfigurationViewer'
import { generateHeaderText } from './utilities'

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
  const editable = () => ['menu', 'menu-item', 'separator'].indexOf(menuConfiguration.type) >= 0

  return (
    <div className='flex flex-col'>
      <div className='collapse-header'>
        <div className='collapse-animation-base bg-dial-blue-chalk h-14' />
        <div className='flex flex-row flex-wrap gap-3 collapse-header'>
          <div className='my-auto cursor-pointer flex-grow' onClick={toggleExpanded}>
            <div className='font-semibold px-4 py-4 flex gap-1'>
              {menuConfiguration.name}
              <span className='text-xs font-normal my-auto'>
                ({generateHeaderText(menuConfiguration)})
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
            setMenuConfigurations={setMenuConfigurations}
          />
          : <MenuConfigurationViewer menuConfiguration={menuConfiguration} />
        }
      </div>
    </div>
  )
}

export default MenuConfiguration