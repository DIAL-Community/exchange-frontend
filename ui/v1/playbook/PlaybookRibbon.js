import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import Ribbon from '../shared/Ribbon'

const PlaybookRibbon = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const titleImage =
    <img
      src='/ui/v1/playbook-header.svg'
      alt={format('ui.image.logoAlt', { name: format('ui.playbook.label') })}
      width={70}
      height={70}
      className='object-contain'
    />

  return (
    <Ribbon
      ribbonBg='bg-dial-violet'
      titleImage={titleImage}
      titleKey={'ui.playbook.header'}
      titleColor='text-dial-plum'
    />
  )
}

export default PlaybookRibbon
