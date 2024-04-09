import React, { useCallback } from 'react'
import { useIntl } from 'react-intl'

const ResourceTopicDetailHeader = ({ resourceTopic }) => {

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      <div className='text-xl text-dial-plum font-semibold'>
        {resourceTopic.name}
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
