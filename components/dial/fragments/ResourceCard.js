import Link from 'next/link'
import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import parse from 'html-react-parser'
import { FaXmark } from 'react-icons/fa6'
import { isValidFn } from '../../utils/utilities'
import { DisplayType } from '../../utils/constants'

const ResourceCard = ({ displayType, index, resource, dismissHandler }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [resourceAuthor] = resource?.authors ?? []

  const displayLargeCard = () =>
    <div className={`px-4 py-6 rounded-lg min-h-[7rem] ${index % 2 === 0 && 'bg-dial-violet'}`}>
      <div className='flex flex-col lg:flex-row gap-x-6 gap-y-3'>
        <div className='w-20 h-20 mx-auto'>
          <img
            src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + resource.imageFile}
            alt={format('ui.image.logoAlt', { name: format('ui.resource.label') })}
            className='aspect-[5/4]'
          />
        </div>
        <div className='flex flex-col gap-y-3 max-w-3xl lg:w-10/12'>
          <div className='text-lg font-semibold text-dial-plum'>
            {resource.name}
          </div>
          <div className='line-clamp-4 text-dial-stratos'>
            {resource?.parsedDescription && parse(resource?.parsedDescription)}
          </div>
          <div className='flex items-center gap-3'>
            {resource.tags && resource.tags.map((tag, i) =>
              (<div key={i} className='bg-dial-plum text-white rounded-md shadow-lg text-xs px-2 py-2'>{tag}</div>))}
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
    <div className='group spotlight-card'>
      <div className='flex flex-col lg:flex-row gap-x-10'>
        <div className='overflow-hidden basis-2/5 shrink-0'>
          <img
            src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + resource.imageFile}
            alt={format('ui.image.logoAlt', { name: format('ui.resource.header') })}
            className='aspect-[3/2]	group-hover:scale-110 transition-all duration-500'
          />
        </div>
        <div className='group-hover:bg-dial-ice lg:px-8 py-6'>
          <div className='flex flex-col gap-y-4'>
            <div className='flex items-center gap-6'>
              {resource.tags && resource.tags.map((tag, i) =>
                (<div key={i} className='bg-dial-plum text-white rounded-md shadow-lg text-xs px-2 py-2'>{tag}</div>))}
              {resource.resourceType &&
                <div className='text-sm'>
                  {format(resource.resourceType)}
                </div>
              }
            </div>
            <div className='text-3xl font-semibold text-dial-iris-blue'>
              {resource.name}
            </div>
            <div className='text-xl leading-8 italic line-clamp-6 text-dial-sapphire'>
              {resource?.parsedDescription && parse(resource?.parsedDescription)}
            </div>
            <div className='flex flex-row items-center gap-3'>
              <img
                src='/ui/v1/author-header.svg'
                className='badge-avatar w-10 h-10'
                alt='Author picture'
              />
              <div className='text-dial-sapphire'>
                {resourceAuthor?.name ?? format('ui.resource.anonymousAuthor')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  const displayFeaturedCard = () =>
    <div className='group featured-card'>
      <div className='flex flex-col gap-y-3 group-hover:bg-dial-ice p-6'>
        <div className='overflow-hidden'>
          <img
            src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + resource.imageFile}
            alt={format('ui.image.logoAlt', { name: format('ui.resource.header') })}
            className='aspect-[5/4]	group-hover:scale-110 transition-all duration-500'
          />
        </div>
        { resource.tags.length > 0 &&
          <div className='flex items-center gap-3'>
            {resource.tags.map((tag, i) =>
              (<div key={i} className='bg-dial-plum text-white rounded-md shadow-lg text-xs px-2 py-2'>{tag}</div>))}
          </div>
        }
        <div className='text-xl font-semibold text-dial-iris-blue'>
          {resource.name}
        </div>
        { resource.source &&
          <div className='text-xs'>This resource provided by {resource.source}</div>
        }
        <div className='line-clamp-4 text-dial-sapphire'>
          {resource?.parsedDescription && parse(resource?.parsedDescription)}
        </div>
        {resource.resourceType &&
          <div className='text-sm'>
            {format(resource.resourceType)}
          </div>
        }
        <div className='flex flex-row items-center gap-2'>
          <img
            src='/ui/v1/author-header.svg'
            className='badge-avatar w-10 h-10'
            alt='Author picture'
          />
          <div className='text-dial-stratos'>
            {resourceAuthor?.name ?? format('ui.resource.anonymousAuthor')}
          </div>
        </div>
      </div>
    </div>

  return (
    <div className='relative'>
      <Link href={`/resources/dial/${resource.slug}`}>
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
