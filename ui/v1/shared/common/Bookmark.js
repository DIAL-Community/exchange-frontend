import { useCallback } from 'react'
import { useIntl } from 'react-intl'

const Bookmark = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-3 py-3'>
      <div className='text-lg text-dial-sapphire font-semibold'>
        {format('ui.bookmark.title')}
      </div>
      <div className='flex flex-row gap-x-3'>
        <img
          src='/ui/v1/bookmark-icon.svg'
          alt={format('ui.image.logoAlt', { name: 'Bookmark' })}
          width={40}
          height={40}
          className='object-contain'
        />
        <div className='text-sm my-auto'>
          {format('ui.bookmark.bookmarkThis')}
        </div>
      </div>
      <div className='text-sm text-dial-stratos'>
        {format('ui.bookmark.subTitle')}
      </div>
    </div>
  )
}

export default Bookmark
