import { useCallback } from 'react'
import { useIntl } from 'react-intl'

const Share = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-3 py-3'>
      <div className='text-lg text-dial-sapphire font-semibold'>
        Share
      </div>
      <div className='flex flex-row gap-3'>
        <img
          src='/ui/v1/twitter-icon.svg'
          alt={format('ui.image.logoAlt', { name: 'Twitter' })}
          width={40}
          height={40}
          className='object-contain'
        />
        <img
          src='/ui/v1/linkedin-icon.svg'
          alt={format('ui.image.logoAlt', { name: 'LinkedIn' })}
          width={40}
          height={40}
          className='object-contain'
        />
        <img
          src='/ui/v1/email-icon.svg'
          alt={format('ui.image.logoAlt', { name: 'Email' })}
          width={40}
          height={40}
          className='object-contain'
        />
        <img
          src='/ui/v1/copy-icon.svg'
          alt={format('ui.image.logoAlt', { name: 'Copy' })}
          width={40}
          height={40}
          className='object-contain'
        />
      </div>
    </div>
  )
}

export default Share
