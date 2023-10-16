import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Link from 'next/link'
import parse from 'html-react-parser'
import { FaXmark } from 'react-icons/fa6'
import { DisplayType } from '../utils/constants'
import { isValidFn } from '../utils/utilities'

const ResourceCard = ({ displayType, index, resource, dismissHandler }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const displayLargeCard = () =>
    <div className={`px-4 py-6 rounded-lg min-h-[7rem] ${index % 2 === 0 && 'bg-dial-violet'}`}>
      <div className='flex flex-col lg:flex-row gap-x-6 gap-y-3'>
        <div className='w-20 h-20 mx-auto'>
          <img
            src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + resource.imageFile}
            alt={format('ui.image.logoAlt', { name: format('ui.resource.label') })}
            className='object-contain w-16 h-16'
          />
        </div>
        <div className='flex flex-col gap-y-3 max-w-3xl lg:w-10/12'>
          <div className='text-lg font-semibold text-dial-plum'>
            {resource.name}
          </div>
          <div className='line-clamp-4 text-dial-stratos'>
            {resource?.description && parse(resource?.description)}
          </div>
          <div className='flex gap-x-2 text-dial-stratos'>
            <div className='text-sm'>
              {format('ui.organization.header')} ({resource.organizations?.length ?? 0})
            </div>
          </div>
        </div>
      </div>
    </div>

  const displaySmallCard = () =>
    <div className='rounded-lg bg-gradient-to-r from-workflow-bg-light to-workflow-bg h-16'>
      <div className='flex flex-row gap-x-3 px-6 h-full'>
        <img
          src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + resource.imageFile}
          alt={format('ui.image.logoAlt', { name: format('ui.resource.header') })}
          className='object-contain w-10 h-10 my-auto'
        />
        <div className='text-sm font-semibold text-dial-plum my-auto'>
          {resource.name}
        </div>
      </div>
    </div>

  const displaySpotlightCard = () =>
    <div className='flex flex-row gap-x-3'>
      <div className='basis-1/2 shrink-0'>
        <img
          src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + resource.imageFile}
          alt={format('ui.image.logoAlt', { name: format('ui.resource.header') })}
          className='object-contain'
        />
      </div>
      <div className='basis-1/2 shrink-0'>
        <div className='flex flex-col gap-y-3'>
          <div className='text-2xl font-semibold text-dial-plum'>
            {resource.name}
          </div>
          <div className='text-lg line-clamp-4 text-dial-stratos'>
            {resource?.description && parse(resource?.description)}
          </div>
        </div>
      </div>
    </div>

  const displayFeaturedCard = () =>
    <div className='flex flex-col gap-y-3'>
      <img
        src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + resource.imageFile}
        alt={format('ui.image.logoAlt', { name: format('ui.resource.header') })}
        className='object-contain my-auto'
      />
    </div>

  return (
    <div className='relative'>
      <Link href={`/resources/${resource.slug}`}>
        {displayType === DisplayType.LARGE_CARD && displayLargeCard()}
        {displayType === DisplayType.SMALL_CARD && displaySmallCard()}
        {displayType === DisplayType.FEATURED_CARD && displayFeaturedCard()}
        {displayType === DisplayType.SPOTLIGHT_CARD && displaySpotlightCard()}
      </Link>
      { isValidFn(dismissHandler) &&
        <button type='button' className='absolute top-2 right-2'>
          <FaXmark size='1rem' className='text-dial-plum' onClick={dismissHandler} />
        </button>
      }
    </div>
  )
}

export default ResourceCard
