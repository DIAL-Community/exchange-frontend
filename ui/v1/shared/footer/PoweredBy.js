import { useCallback } from 'react'
import { useIntl } from 'react-intl'

const PoweredBy = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-3 py-3'>
      <div className='text-lg text-dial-sapphire font-semibold'>
        {format('ui.footer.poweredBy.title')}
      </div>
      <hr className='bg-dial-angel'/>
      <div className='flex gap-x-8'>
        <a href='//dial.global' target='_blank' rel='noreferrer'>
          <img
            src='/ui/v1/dial-logo.svg'
            alt={format('ui.image.logoAlt', { name: 'DIAL' })}
            width={96}
            className='object-contain'
          />
        </a>
        <div className='text-sm text-dial-stratos'>
          {format('ui.footer.poweredBy.subTitle')}
        </div>
      </div>
      <div className='flex gap-3 ml-auto pt-3'>
        <img
          src='/ui/v1/twitter-icon-wo-bg.svg'
          alt={format('ui.image.logoAlt', { name: 'Twitter' })}
          width={30}
          className='object-contain'
        />
        <img
          src='/ui/v1/linkedin-icon-wo-bg.svg'
          alt={format('ui.image.logoAlt', { name: 'LinkedIn' })}
          width={30}
          className='object-contain'
        />
      </div>
    </div>
  )
}

export default PoweredBy
