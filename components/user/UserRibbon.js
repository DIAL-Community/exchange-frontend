import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import Ribbon from '../shared/Ribbon'

const UserRibbon = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const titleImage =
    <img
      src='/ui/v1/user-header.svg'
      alt={format('ui.image.logoAlt', { name: format('ui.user.label') })}
      width={70}
      height={70}
      className='object-contain mx-auto'
    />

  return (
    <Ribbon
      ribbonBg='bg-dial-violet'
      titleImage={titleImage}
      titleKey={'ui.user.header'}
      titleColor='text-dial-stratos'
    />
  )
}

export default UserRibbon
