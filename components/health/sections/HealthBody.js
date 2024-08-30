import { useCallback } from 'react'
import { useIntl } from 'react-intl'

const HealthBody = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='relative'>
      <img className='h-96 w-full' alt='DIAL DPI Resource Hub' src='/images/hero-image/health-cover.png' />
      <div className='absolute top-1/2 -translate-y-1/2 px-4 lg:px-8 xl:px-56 text-dial-cotton'>
        <div className='flex flex-col gap-2 max-w-prose'>
          <div className='text-3xl leading-tight font-bold py-3'>
            {format('health.landing.main.title')}
          </div>
          <div className='text-3xl'>
            {format('health.landing.main.subtitle')}
          </div>
          <div className='max-w-prose'>
            {format('health.landing.main.powered')}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HealthBody
