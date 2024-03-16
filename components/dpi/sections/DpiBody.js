import { useCallback } from 'react'
import { useIntl } from 'react-intl'

const DpiBody = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='px-4 lg:px-8 xl:px-56 py-8 bg-dial-teal text-white '>
      <div className='flex flex-col gap-2 max-w-prose'>
        <div className='text-[3.5rem] leading-tight font-light py-3'>
          {format('dpi.landing.main.title')}
        </div>
        <div className='max-w-prose'>
          {format('dpi.landing.main.subtitle')}
        </div>
      </div>
    </div>
  )
}

export default DpiBody
