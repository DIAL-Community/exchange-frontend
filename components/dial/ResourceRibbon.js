import { useCallback } from 'react'
import { useIntl } from 'react-intl'

const ResourceRibbon = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div
      className='rounded-b-[64px] z-40 bg-cover bg-top h-[160px]'
      style={{
        backgroundImage: 'url("/ui/v1/research-header.png")'
      }}
    >
      <div className='flex h-full items-center'>
        <div className='px-8 xl:px-56 text-2xl text-white'>
          {format('ui.hub.ribbon.tagLine')}
          <div className='py-3 text-base text-white italic'>
            {format('ui.hub.ribbon.subTagLine')}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResourceRibbon
