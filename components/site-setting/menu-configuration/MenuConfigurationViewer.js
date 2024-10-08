import { FormattedMessage } from 'react-intl'
import { generateMenuHeaderText } from '../utilities'

const MenuConfigurationViewer = ({ menuConfiguration }) => {
  return (
    <div className='px-8 py-6'>
      <div className='flex flex-col gap-3 text-sm'>
        <div className='flex flex-col gap-1'>
          <div className='font-medium'>
            <FormattedMessage id='ui.siteSetting.menu.name' />
          </div>
          <div className='text-base font-semibold'>
            <FormattedMessage
              id={menuConfiguration.name}
              defaultMessage={menuConfiguration.name}
            />
          </div>
        </div>
        <span className='text-xs font-normal my-auto'>
          {generateMenuHeaderText(menuConfiguration)}
        </span>
      </div>
    </div>
  )
}

export default MenuConfigurationViewer
