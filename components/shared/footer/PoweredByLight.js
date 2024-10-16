import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import parse from 'html-react-parser'

const PoweredBy = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-3 py-3 max-w-xl'>
      <div className='flex flex-col gap-x-8'>
        <a href='//exchange.dial.global' target='_blank' rel='noreferrer'>
          <img
            src='/ui/v1/exchange-logo.svg'
            alt={format('ui.image.logoAlt', { name: 'DIAL' })}
            width={200}
            className='object-contain'
          />
        </a>
        <div className='text-sm text-dial-angel'>
          {parse(format('ui.footer.poweredByLight.subTitle'))}
        </div>
      </div>
    </div>
  )
}

export default PoweredBy
