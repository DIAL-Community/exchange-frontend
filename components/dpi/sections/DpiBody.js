import { useCallback } from 'react'
import { useIntl } from 'react-intl'

const DpiBody = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='relative'>
      <img className='h-96 w-full object-cover' alt='DIAL DPI Resource Hub' src='/images/hero-image/dpi-cover.svg' />
      <div className='absolute top-1/2 -translate-y-1/2 px-4 lg:px-8 xl:px-56 text-white'>
        <div className='flex flex-col gap-2 max-w-prose'>
          <div className='text-[3.5rem] leading-tight font-light py-3'>
            {format('dpi.landing.main.title')}
          </div>
          <div className='max-w-prose'>
            {format('dpi.landing.main.subtitle')}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DpiBody
