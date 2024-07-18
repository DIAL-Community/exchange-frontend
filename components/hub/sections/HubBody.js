import { useCallback } from 'react'
import { useIntl } from 'react-intl'

const HubBody = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='relative'>
      <img className='h-96 w-full object-cover' alt='DIAL DPI Resource Hub' src='/images/hero-image/hub-cover.svg' />
      <div className='absolute top-1/2 -translate-y-1/2 px-4 lg:px-8 xl:px-56 text-dial-cotton'>
        <div className='flex flex-col gap-2 max-w-prose'>
          <div className='text-3xl leading-tight font-light py-3'>
            {format('hub.landing.main.title')}
          </div>
          <div className='max-w-prose'>
            {format('hub.landing.main.subtitle')}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HubBody
