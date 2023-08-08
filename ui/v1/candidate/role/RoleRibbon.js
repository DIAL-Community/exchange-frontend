import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import Ribbon from '../../shared/Ribbon'

const RoleRibbon = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const titleImage =
    <img
      src='/ui/v1/role-header.svg'
      alt={format('ui.image.logoAlt', { name: format('ui.role.label') })}
      width={70}
      height={70}
      className='object-contain'
    />

  return (
    <Ribbon
      ribbonBg='bg-dial-spearmint'
      titleImage={titleImage}
      titleKey={'ui.role.header'}
      titleColor='text-dial-meadow'
    />
  )
}

export default RoleRibbon
