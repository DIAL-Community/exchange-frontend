import { useCallback } from 'react'
import { useIntl } from 'react-intl'

const PoweredBy = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-3 py-3 max-w-xl'>
      <div className='text-dial-cotton font-semibold'>
        {format('ui.footer.poweredBy.title')}
      </div>
      <hr className='border-b border-dial-angel'/>
      <div className='flex gap-x-8'>
        <a href='//exchange.dial.global' target='_blank' rel='noreferrer'>
          <img
            src='/ui/v1/exchange-logo.svg'
            alt={format('ui.image.logoAlt', { name: 'DIAL' })}
            width={96}
            className='object-contain'
          />
        </a>
        <div className='text-sm text-dial-angel'>
          {format('ui.footer.poweredBy.subTitle')}
        </div>
      </div>
    </div>
  )
}

export default PoweredBy
