import { useCallback } from 'react'
import { useIntl } from 'react-intl'

const PoweredBy = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-3 py-3 max-w-lg'>
      <div className=' text-dial-sapphire font-semibold'>
        Developed by
      </div>
      <hr className='border-b border-dial-angel'/>
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
    </div>
  )
}

export default PoweredBy
