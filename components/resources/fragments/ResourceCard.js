import { useCallback } from 'react'
import parse from 'html-react-parser'
import Link from 'next/link'
import { FaXmark } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { DisplayType } from '../../utils/constants'
import { isValidFn } from '../../utils/utilities'

const ResourceCard = ({ displayType, index, resource, dismissHandler }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [resourceAuthor] = resource?.authors ?? []

  const displayLargeCard = () =>
    <div className={`px-4 py-6 rounded-lg h-[14rem] ${index % 2 === 0 && 'bg-dial-violet'}`}>
      <div className='flex flex-col lg:flex-row gap-x-6 gap-y-3'>
        <Link href={`/resources/${resource.slug}`} className='flex items-center justify-center'>
          {resource.imageFile.indexOf('placeholder.svg') >= 0 &&
            <div className='w-24 h-24 py-4 my-auto shrink-0'>
              <img
                src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + resource.imageFile}
                alt={format('ui.image.logoAlt', { name: format('ui.resource.label') })}
                className='aspect-auto'
              />
            </div>
          }
          {resource.imageFile.indexOf('placeholder.svg') < 0 &&
            <div className='w-24 h-24 py-4 my-auto shrink-0'>
              <img
                src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + resource.imageFile}
                alt={format('ui.image.logoAlt', { name: format('ui.resource.label') })}
                className='w-16 h-16 m-auto'
              />
            </div>
          }
        </Link>
        <div className='flex flex-grow flex-col gap-y-3 max-w-3xl h-[11rem]'>
          <Link href={`/resources/${resource.slug}`}>
            <div className='text-lg font-semibold text-dial-plum'>
              {resource.name}
            </div>
            <div className='line-clamp-4 text-dial-stratos'>
              {resource?.parsedDescription && parse(resource?.parsedDescription)}
            </div>
          </Link>
          <div className='flex items-center gap-3 text-white text-xs'>
            {resource.resourceTopics.map((resourceTopic, i) =>
              <Link key={i} href={`/resource-topics/${resourceTopic.slug}`}>
                <div className='bg-dial-plum rounded-md shadow-lg px-2 py-2'>
                  {resourceTopic.name}
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>

  const displayHubCard = () =>
    <div className={`rounded-lg min-h-[6rem] ${index % 2 === 0 && 'bg-dial-violet'}`}>
      <div className='min-w-80 pb-4 mx-auto flex flex-col gap-3'>
        <div className='w-full flex justify-center items-center'>
          <Link href={`/hub/resources/${resource.slug}`} className='w-full h-[267px]'>
            {resource.imageFile.indexOf('placeholder.svg') >= 0 &&
              <img
                src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + resource.imageFile}
                alt={format('ui.image.logoAlt', { name: format('ui.resource.label') })}
                className='aspect-auto h-[267px]'
              />
            }
            {resource.imageFile.indexOf('placeholder.svg') < 0 &&
              <img
                src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + resource.imageFile}
                alt={format('ui.image.logoAlt', { name: format('ui.resource.label') })}
                className='mx-auto aspect-auto h-[267px]'
              />
            }
          </Link>
        </div>
        <Link href={`/hub/resources${resource.slug}`}>
          <div className='text-lg font-semibold text-dial-stratos'>
            {resource.name}
          </div>
        </Link>
        <Link href={`/hub/resources${resource.slug}`}>
          <div className='line-clamp-4 text-dial-stratos text-sm'>
            {resource?.parsedDescription && parse(resource?.parsedDescription)}
          </div>
        </Link>
      </div>
    </div>

  const displaySmallCard = () =>
    <Link href={`/resources/${resource.slug}`}>
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
    </Link>

  const displayFeaturedCard = () =>
    <div className='group featured-card'>
      <div className='flex flex-col gap-y-3 group-hover:bg-dial-ice p-6'>
        <Link href={`/resources/${resource.slug}`}>
          <div className='overflow-hidden'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + resource.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.resource.header') })}
              className='aspect-[5/4]	group-hover:scale-110 transition-all duration-500'
            />
          </div>
        </Link>
        { resource.resourceTopics.length > 0 &&
          <div className='flex items-center gap-3 text-white text-xs'>
            {resource.resourceTopics.map((resourceTopic, i) =>
              <Link key={i} href={`/resource-topics/${resourceTopic.slug}`}>
                <div className='bg-dial-plum rounded-md shadow-lg px-2 py-2'>
                  {resourceTopic.name}
                </div>
              </Link>
            )}
          </div>
        }
        <Link href={`/resources/${resource.slug}`}>
          <div className='text-xl font-semibold text-dial-iris-blue'>
            {resource.name}
          </div>
          {resource.source &&
            <div className='text-xs'>
              {`${format('ui.resource.source')}: ${resource.source.name}`}
            </div>
          }
          <div className='line-clamp-4 text-dial-sapphire'>
            {resource?.parsedDescription && parse(resource?.parsedDescription)}
          </div>
        </Link>
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
      {displayType === DisplayType.LARGE_CARD && displayLargeCard()}
      {displayType === DisplayType.SMALL_CARD && displaySmallCard()}
      {displayType === DisplayType.FEATURED_CARD && displayFeaturedCard()}
      {displayType === DisplayType.HUB_CARD && displayHubCard()}
      { isValidFn(dismissHandler) &&
        <button type='button' className='absolute top-2 right-2'>
          <FaXmark size='1rem' className='text-dial-plum' onClick={dismissHandler} />
        </button>
      }
    </div>
  )
}

export default ResourceCard
