import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import Ribbon from '../shared/Ribbon'

const SectorRibbon = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const titleImage =
    <div className='bg-dial-plum rounded-full w-[70px] h-[70px]'>
      <img
        src='/ui/v1/sector-header.svg'
        alt={format('ui.image.logoAlt', { name: format('ui.sector.label') })}
        width={40}
        height={40}
        className='object-contain mt-3 mx-auto white-filter'
      />
    </div>

  return (
    <Ribbon
      ribbonBg='bg-dial-violet'
      titleImage={titleImage}
      titleKey={'ui.sector.header'}
      titleColor='text-dial-plum'
    />
  )
}

export default SectorRibbon
