import { useCallback } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

const MenuConfigurationViewer = ({ menuConfiguration }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='px-8 py-6'>
      <div className='flex flex-col gap-3 text-sm'>
        <div className='flex flex-col gap-1'>
          <div className='font-medium'>
            <FormattedMessage id='ui.siteSetting.menu.name' />
          </div>
          <div className='text-base font-semibold'>
            {menuConfiguration.name}
          </div>
        </div>
        {menuConfiguration.type === 'menu'
          // Rendering destination url for type = 'menu' without menu items.
          ? menuConfiguration.menuItemConfigurations.length <= 0
            ? <span className='text-sm'>
              {`${format('ui.siteSetting.menu.destinationUrl')}: ${menuConfiguration.destinationUrl}`}
            </span>
            // Rendering drop down menu text for type = 'menu' with menu items.
            : <span className='text-sm'>
              {format('ui.siteSetting.menu.dropdown')}
            </span>
          // Rendering destination url for type = 'menu-item'.
          : <span className='text-sm'>
            {`${format('ui.siteSetting.menu.destinationUrl')}: ${menuConfiguration.destinationUrl}`}
          </span>
        }
      </div>
    </div>
  )
}

export default MenuConfigurationViewer
