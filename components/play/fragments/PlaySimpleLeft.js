import { useIntl } from 'react-intl'
import { useCallback } from 'react'

const PlaySimpleLeft = ({ play }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='bg-dial-slate-100 h-full'>
      <div className='flex flex-col gap-y-3 px-4'>
        <div className='text-xl font-semibold text-dial-plum'>
          {play?.name ?? format('app.new', { entity: format('ui.play.label') })}
        </div>
        <div className='flex justify-center items-center py-16 bg-white rounded'>
          <img
            src='/ui/v1/play-header.svg'
            alt={format('ui.image.logoAlt', { name: format('ui.play.label') })}
            width={100}
            height={100}
            className='object-contain object-center'
          />
        </div>
      </div>
    </div>
  )
}

export default PlaySimpleLeft
