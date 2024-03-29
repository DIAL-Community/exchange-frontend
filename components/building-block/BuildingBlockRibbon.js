import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import Ribbon from '../shared/Ribbon'

const BuildingBlockRibbon = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const titleImage =
    <img
      src='/ui/v1/building-block-header.svg'
      alt={format('ui.image.logoAlt', { name: format('ui.buildingBlock.label') })}
      width={70}
      height={70}
      className='object-contain'
    />

  return (
    <Ribbon
      ribbonBg='bg-dial-warm-beech'
      titleImage={titleImage}
      titleKey={'ui.buildingBlock.header'}
      titleColor='text-dial-ochre'
    />
  )
}

export default BuildingBlockRibbon
