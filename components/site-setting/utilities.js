import { FormattedMessage } from 'react-intl'

export const generateMenuHeaderText = (menuConfiguration) => {
  const generateDestinationText = (url) => <><FormattedMessage id='ui.siteSetting.menu.destinationUrl' />: {url}</>
  const generateStaticText = (id) => <FormattedMessage id={id} />

  return menuConfiguration.type === 'menu'
    ? menuConfiguration.menuItemConfigurations.length <= 0
      ? generateDestinationText(menuConfiguration.destinationUrl)
      : generateStaticText('ui.siteSetting.menu.type.dropdown')
    : menuConfiguration.type === 'menu.item'
      ? generateDestinationText(menuConfiguration.destinationUrl)
      : menuConfiguration.type === 'separator'
        ? generateStaticText('ui.siteSetting.menu.type.separator')
        : generateStaticText('ui.siteSetting.menu.type.locked')
}

export const generateCarouselHeaderText = (menuConfiguration) => {
  const generateDestinationText = (url) => <><FormattedMessage id='ui.siteSetting.carousel.destinationUrl' />: {url}</>
  const generateStaticText = (id) => <FormattedMessage id={id} />

  return menuConfiguration.type === 'generic-carousel'
    ? generateDestinationText(menuConfiguration.destinationUrl)
    : generateStaticText('ui.siteSetting.carousel.type.locked')
}

export const generateHeroCardHeaderText = (menuConfiguration) => {
  const generateDestinationText = (url) => <><FormattedMessage id='ui.siteSetting.heroCard.destinationUrl' />: {url}</>
  const generateStaticText = (id) => <FormattedMessage id={id} />

  return menuConfiguration.type === 'generic-carousel'
    ? generateDestinationText(menuConfiguration.destinationUrl)
    : generateStaticText('ui.siteSetting.heroCard.type.locked')
}
