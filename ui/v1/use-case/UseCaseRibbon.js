import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import Ribbon from '../shared/Ribbon'

const UseCaseRibbon = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const titleImage =
    <img
      src='/ui/v1/use-case-header.svg'
      alt={format('ui.image.logoAlt', { name: 'Use Cases' })}
      width={70}
      height={70}
      className='object-contain'
    />

  return (
    <Ribbon
      ribbonBg='bg-dial-blue-chalk'
      titleImage={titleImage}
      titleKey={'ui.useCase.header'}
      titleColor='text-dial-blueberry'
    />
  )
}

export default UseCaseRibbon
