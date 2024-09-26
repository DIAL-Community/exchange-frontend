import { FormattedMessage } from 'react-intl'

export const generateHeaderText = (menuConfiguration) => {
  const generateDestinationText = (url) => <><FormattedMessage id='ui.siteSetting.menu.destinationUrl' />: {url}</>
  const generateStaticText = (id) => <FormattedMessage id={id} />

  return menuConfiguration.type === 'menu'
    ? menuConfiguration.menuItemConfigurations.length <= 0
      ? generateDestinationText(menuConfiguration.destinationUrl)
      : generateStaticText('ui.siteSetting.menu.dropdown')
    : menuConfiguration.type === 'menu-item'
      ? generateDestinationText(menuConfiguration.destinationUrl)
      : menuConfiguration.type === 'separator'
        ? generateStaticText('ui.siteSetting.menu.separator')
        : generateStaticText('ui.siteSetting.menu.locked')
}