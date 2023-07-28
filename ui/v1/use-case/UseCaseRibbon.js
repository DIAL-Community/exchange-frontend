import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import Ribbon from '../shared/Ribbon'
import MobileFilter from '../shared/MobileFilter'
import UseCaseFilter from './fragments/UseCaseFilter'

const UseCaseRibbon = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const titleImage =
    <img
      src='/ui/v1/use-case-header.svg'
      alt={format('ui.image.logoAlt', { name: format('ui.useCase.label') })}
      width={70}
      height={70}
      className='object-contain'
    />

  const mobileFilter =
    <MobileFilter
      bgColor='bg-dial-blue-chalk'
      iconColor='text-dial-blueberry'
      entityFilter={<UseCaseFilter />}
    />

  return (
    <Ribbon
      ribbonBg='bg-dial-blue-chalk'
      titleImage={titleImage}
      titleKey={'ui.useCase.header'}
      titleColor='text-dial-blueberry'
      mobileFilter={mobileFilter}
    />
  )
}

export default UseCaseRibbon
