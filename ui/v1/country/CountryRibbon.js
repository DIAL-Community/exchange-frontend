import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import Ribbon from '../shared/Ribbon'

const CountryRibbon = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const titleImage =
    <div className='bg-dial-plum rounded-full w-[70px] h-[70px]'>
      <img
        src='/ui/v1/country-header.svg'
        alt={format('ui.image.logoAlt', { name: format('ui.country.label') })}
        width={40}
        height={40}
        className='object-contain mt-4 mx-auto white-filter'
      />
    </div>

  return (
    <Ribbon
      ribbonBg='bg-dial-violet'
      titleImage={titleImage}
      titleKey={'ui.country.header'}
      titleColor='text-dial-plum'
    />
  )
}

export default CountryRibbon
