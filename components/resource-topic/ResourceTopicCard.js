import { useCallback } from 'react'
import parse from 'html-react-parser'
import Link from 'next/link'
import { FaXmark } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { DisplayType } from '../utils/constants'
import { isValidFn } from '../utils/utilities'

const ResourceTopicCard = ({ displayType, index, resourceTopic, dismissHandler }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const displayLargeCard = () =>
    <div className={`px-4 py-6 rounded-lg min-h-[10rem] ${index % 2 === 0 && 'bg-dial-violet'}`}>
      <div className='flex flex-col lg:flex-row gap-x-6 gap-y-3'>
        <div className='w-20 h-20'>
          {resourceTopic.imageFile.indexOf('placeholder.svg') < 0 &&
            <div className='flex items-center justify-center h-full bg-dial-plum rounded-full'>
              <img
                src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + resourceTopic.imageFile}
                alt={format('ui.image.logoAlt', { name: format('ui.resourceTopic.label') })}
                className='object-contain w-10 h-10 mx-auto my-2 white-filter'
              />
            </div>
          }
          {resourceTopic.imageFile.indexOf('placeholder.svg') >= 0 &&
            <div className='flex items-center justify-center h-full bg-dial-plum rounded-full'>
              <img
                src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + resourceTopic.imageFile}
                alt={format('ui.image.logoAlt', { name: format('ui.resourceTopic.label') })}
                className='object-contain w-12 h-12 white-filter'
              />
            </div>
          }
        </div>
        <div className='flex flex-col gap-y-3 grow'>
          <div className='text-lg font-semibold text-dial-plum'>
            {resourceTopic.name}
          </div>
          <div className='line-clamp-4 text-dial-stratos'>
            {resourceTopic?.resourceTopicDescription && parse(resourceTopic?.resourceTopicDescription.description)}
          </div>
          <div className='flex gap-x-2 text-dial-stratos'>
            <div className='text-sm'>
              {format('ui.resource.header')} ({resourceTopic.resources?.length ?? 0})
            </div>
          </div>
        </div>
      </div>
    </div>

  const displaySmallCard = () =>
    <div className='rounded-lg bg-gradient-to-r from-resourceTopic-bg-light to-resourceTopic-bg h-16'>
      <div className='flex flex-row gap-x-3 px-6 h-full'>
        <div className='text-sm font-semibold text-dial-plum my-auto'>
          {resourceTopic.name}
        </div>
      </div>
    </div>

  return (
    <div className='relative'>
      <Link href={`/resource-topics/${resourceTopic.slug}`}>
        {displayType === DisplayType.LARGE_CARD && displayLargeCard()}
        {displayType === DisplayType.SMALL_CARD && displaySmallCard()}
      </Link>
      { isValidFn(dismissHandler) &&
        <button type='button' className='absolute top-2 right-2'>
          <FaXmark size='1rem' className='text-dial-plum' onClick={dismissHandler} />
        </button>
      }
    </div>
  )
}

export default ResourceTopicCard
