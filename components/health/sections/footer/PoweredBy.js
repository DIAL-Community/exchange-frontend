import { useCallback } from 'react'
import { useIntl } from 'react-intl'

const PoweredBy = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-3 py-3'>
      <div className='text-xs text-dial-cotton'>
        {format('ui.footer.poweredBy.title')}
      </div>
      <div className='flex gap-x-8'>
        <a href='//dial.global' target='_blank' rel='noreferrer'>
          <img
            src='/ui/v1/dial-logo-white.svg'
            alt={format('ui.image.logoAlt', { name: 'DIAL' })}
            width={96}
            className='object-contain'
          />
        </a>
      </div>
    </div>
  )
}

export default PoweredBy
