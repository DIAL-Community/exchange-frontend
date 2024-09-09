import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Ribbon from '../../shared/Ribbon'

const ResourceRibbon = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const titleImage =
    <img
      src='/ui/v1/resource-header.svg'
      alt={format('ui.image.logoAlt', { name: format('ui.candidateResource.label') })}
      width={70}
      height={70}
      className='object-contain'
    />

  return (
    <Ribbon
      ribbonBg='bg-dial-spearmint'
      titleImage={titleImage}
      titleKey={'ui.candidateResource.header'}
      titleColor='text-dial-meadow'
    />
  )
}

export default ResourceRibbon
