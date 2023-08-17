import { useCallback } from 'react'
import { useIntl } from 'react-intl'

const Partner = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-3 py-3'>
      <div className='text-lg text-dial-sapphire font-semibold'>
        {format('ui.footer.partner.title')}
      </div>
      <hr className='border-b border-dial-angel'/>
      <div className='flex gap-3 pt-3'>
        <a href='//unfoundation.org' target='_blank' rel='noreferrer'>
          <img
            src='/ui/v1/unf-logo.svg'
            alt={format('ui.image.logoAlt', { name: 'UNF' })}
            width={100}
            className='object-contain'
          />
        </a>
        <a href='//www.gatesfoundation.org' target='_blank' rel='noreferrer'>
          <img
            src='/ui/v1/bmgf-logo.svg'
            alt={format('ui.image.logoAlt', { name: 'BMGF' })}
            width={100}
            className='object-contain'
          />
        </a>
        <a href='//www.sida.se' target='_blank' rel='noreferrer'>
          <img
            src='/ui/v1/sida-logo.svg'
            alt={format('ui.image.logoAlt', { name: 'SIDA' })}
            width={100}
            className='object-contain'
          />
        </a>
        <a
          href='//www.gov.uk/government/organisations/foreign-commonwealth-development-office'
          target='_blank' rel='noreferrer'
        >
          <img
            src='/ui/v1/ukaid-logo.svg'
            alt={format('ui.image.logoAlt', { name: 'UK Aid' })}
            width={100}
            className='object-contain'
          />
        </a>
        <a href='//www.giz.de' target='_blank' rel='noreferrer'>
          <img
            src='/ui/v1/giz-logo.svg'
            alt={format('ui.image.logoAlt', { name: 'GIZ' })}
            width={100}
            className='object-contain'
          />
        </a>
        <a href='//www.bmz.de' target='_blank' rel='noreferrer'>
          <img
            src='/ui/v1/bmz-logo.svg'
            alt={format('ui.image.logoAlt', { name: 'BMZ' })}
            width={100}
            className='object-contain'
          />
        </a>
      </div>
    </div>
  )
}

export default Partner
