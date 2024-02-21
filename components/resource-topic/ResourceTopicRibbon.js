import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Ribbon from '../shared/Ribbon'

const ResourceTopicRibbon = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const titleImage =
    <div className='bg-dial-plum rounded-full w-[70px] h-[70px] flex items-center'>
      <img
        src='/ui/v1/resource-topic-header.svg'
        alt={format('ui.image.logoAlt', { name: format('ui.resourceTopic.label') })}
        width={40}
        height={40}
        className='object-contain mx-auto white-filter'
      />
    </div>

  return (
    <Ribbon
      ribbonBg='bg-dial-violet'
      titleImage={titleImage}
      titleKey={'ui.resourceTopic.header'}
      titleColor='text-dial-plum'
    />
  )
}

export default ResourceTopicRibbon
