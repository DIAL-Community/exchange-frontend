import { useCallback } from 'react'
import { useIntl } from 'react-intl'

const Partner = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-3 py-3'>
      <div className='text-lg text-dial-sapphire font-semibold'>
        Our partners and supporters
      </div>
      <hr className='bg-dial-angel'/>
      <div className='flex gap-3 pt-3'>
        <img
          src='/ui/v1/unf-logo.svg'
          alt={format('ui.image.logoAlt', { name: 'UNF' })}
          width={100}
          className='object-contain'
        />
        <img
          src='/ui/v1/bmgf-logo.svg'
          alt={format('ui.image.logoAlt', { name: 'BMGF' })}
          width={100}
          className='object-contain'
        />
        <img
          src='/ui/v1/sida-logo.svg'
          alt={format('ui.image.logoAlt', { name: 'SIDA' })}
          width={100}
          className='object-contain'
        />
        <img
          src='/ui/v1/ukaid-logo.svg'
          alt={format('ui.image.logoAlt', { name: 'UK Aid' })}
          width={100}
          className='object-contain'
        />
        <img
          src='/ui/v1/giz-logo.svg'
          alt={format('ui.image.logoAlt', { name: 'GIZ' })}
          width={100}
          className='object-contain'
        />
        <img
          src='/ui/v1/bmz-logo.svg'
          alt={format('ui.image.logoAlt', { name: 'BMZ' })}
          width={100}
          className='object-contain'
        />
      </div>
    </div>
  )
}

export default Partner
