import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import Ribbon from '../shared/Ribbon'
import { useUser } from '../../../lib/hooks'

const UserRibbon = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user } = useUser()

  const titleImage =
    <img
      src='/ui/v1/user-header.svg'
      alt={format('ui.image.logoAlt', { name: format('ui.user.label') })}
      width={70}
      height={70}
      className='object-contain'
    />

  const breadcrumb = (() => {
    const map = {}
    map[user?.id] = user?.userName

    return map
  })()

  return (
    <Ribbon
      ribbonBg='bg-dial-cotton'
      titleImage={titleImage}
      titleKey={'ui.profile.title'}
      titleColor='text-dial-sapphire'
      breadcrumb={breadcrumb}
    />
  )
}

export default UserRibbon
