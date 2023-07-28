import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import Ribbon from '../shared/Ribbon'
import MobileFilter from '../shared/MobileFilter'
import BuildingBlockFilter from './fragments/BuildingBlockFilter'

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

  const mobileFilter =
    <MobileFilter
      bgColor='bg-dial-warm-beech'
      iconColor='text-dial-ochre'
      entityFilter={<BuildingBlockFilter />}
    />

  return (
    <Ribbon
      ribbonBg='bg-dial-warm-beech'
      titleImage={titleImage}
      titleKey={'ui.buildingBlock.header'}
      titleColor='text-dial-ochre'
      mobileFilter={mobileFilter}
    />
  )
}

export default BuildingBlockRibbon
