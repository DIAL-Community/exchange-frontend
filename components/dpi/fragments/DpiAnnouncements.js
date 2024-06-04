import { useCallback } from 'react'
import { useIntl } from 'react-intl'

const DpiAnnouncements = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='announcement-section'>
      <div className='px-4 lg:px-8 xl:px-56'>
        <div className='text-2xl text-center py-8 text-dial-stratos'>
          {format('dpi.announcement.header')}
        </div>
      </div>
    </div>
  )
}

export default DpiAnnouncements
