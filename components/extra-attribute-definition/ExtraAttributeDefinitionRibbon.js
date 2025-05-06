import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Ribbon from '../shared/Ribbon'

const ExtraAttributeDefinitionRibbon = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const titleImage =
    <img
      src='/ui/v1/extra-attribute-definition-header.svg'
      alt={format('ui.image.logoAlt', { name: format('ui.extraAttributeDefinition.label') })}
      width={50}
      height={50}
      className='object-contain mx-auto'
    />

  return (
    <Ribbon
      ribbonBg='bg-dial-violet'
      titleImage={titleImage}
      titleKey={'ui.extraAttributeDefinition.header'}
      titleColor='text-dial-plum'
    />
  )
}

export default ExtraAttributeDefinitionRibbon
