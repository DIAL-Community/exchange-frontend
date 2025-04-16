import { useCallback } from 'react'
import { useIntl } from 'react-intl'

const ResourceTopicDetailHeader = ({ resourceTopic }) => {

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      <div className='text-xl text-dial-plum font-semibold'>
        {resourceTopic.name}
      </div>
      <div className='flex justify-center items-center py-16 bg-white rounded border'>
        {resourceTopic.imageFile.indexOf('placeholder.svg') < 0 &&
          <div className='w-20 h-20 px-1 py-1 rounded-full bg-dial-plum'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + resourceTopic.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.resourceTopic.label') })}
              className='object-contain dial-ochre-filter w-14 h-14 mx-auto my-2 white-filter'
            />
          </div>
        }
        {resourceTopic.imageFile.indexOf('placeholder.svg') >= 0 &&
          <div className='w-20 h-20'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + resourceTopic.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.resourceTopic.label') })}
              className='object-contain dial-ochre-filter'
            />
          </div>
        }
      </div>
      {resourceTopic.parentTopic && (
        <div className='text-sm text-dial-grey'>
          <div class='font-semibold'>
            {format('ui.resourceTopic.parentTopic')}:
          </div>
          {resourceTopic.parentTopic.name}
        </div>
      )}
    </div>
  )
}

export default ResourceTopicDetailHeader
