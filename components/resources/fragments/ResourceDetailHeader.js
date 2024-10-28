import { useCallback } from 'react'
import Link from 'next/link'
import { useIntl } from 'react-intl'
import { prependUrlWithProtocol } from '../../utils/utilities'
import ResourceDetailCountries from './ResourceDetailCountries'
import ResourceDetailTags from './ResourceDetailTags'

const ResourceDetailHeader = ({ resource, editingAllowed }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const generateResourceUrl = () => {
    let resourceLinkUrl
    if (resource.resourceFile) {
      resourceLinkUrl = `${process.env.NEXT_PUBLIC_GRAPHQL_SERVER}${resource.resourceFile}`
    } else if (resource.resourceLink) {
      resourceLinkUrl = prependUrlWithProtocol(resource.resourceLink)
    }

    return resourceLinkUrl
  }

  return (
    <div className='flex flex-col gap-y-3 py-3 text-sm'>
      <div className='flex justify-center items-center bg-white rounded border min-h-[14rem]'>
        {resource.imageFile.indexOf('placeholder.svg') < 0 &&
          <div className='w-24 h-24 my-auto shrink-0'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + resource.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.buildingBlock.label') })}
              className='object-contain'
            />
          </div>
        }
        {resource.imageFile.indexOf('placeholder.svg') >= 0 &&
          <img
            src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + resource.imageFile}
            alt={format('ui.image.logoAlt', { name: format('ui.buildingBlock.label') })}
            className='object-contain'
          />
        }
      </div>
      <div className='text-dial-stratos font-semibold'>
        {format('ui.resource.author.header')}
      </div>
      {resource?.authors.map((author, index) =>
        <div key={index} className='flex flex-row items-center gap-3'>
          <img
            src={author?.picture}
            className='badge-avatar w-8 h-8'
            alt='Author picture'
          />
          <div className='text-dial-stratos'>
            {author?.name}
          </div>
        </div>
      )}
      <hr className='border-b border-dial-blue-chalk my-3' />
      <div className='text-dial-stratos font-semibold'>
        {format('ui.resource.source')}
      </div>
      {resource.source &&
        <Link href={`/organizations/${resource.source.slug}`} className='flex'>
          <div className='border-b border-dial-iris-blue line-clamp-1 break-all'>
            {resource.source.name}
          </div>
        </Link>
      }
      <hr className='border-b border-dial-blue-chalk my-3' />
      <div className='flex flex-col gap-y-2'>
        <div className='font-semibold text-dial-stratos'>
          {format('ui.resource.resourceLink')}
        </div>
        <div className='flex text-dial-stratos'>
          <a
            href={generateResourceUrl()}
            target='_blank'
            rel='noreferrer'
            className='flex border-b border-dial-iris-blue '>
            <div className='line-clamp-1 break-all'>
              {resource.linkDescription
                ? resource.linkDescription
                : resource.resourceFile
                  ? resource.resourceFile
                  : resource.resourceLink
              }
            </div>
          </a>
          &nbsp;⧉
        </div>
      </div>
      {resource?.submittedBy &&
        <>
          <hr className='border-b border-dial-blue-chalk my-3' />
          <div className='flex flex-col gap-y-2'>
            <div className='font-semibold text-dial-stratos'>
              {format('ui.resource.submittedBy')}
            </div>
            <div className='my-auto text-sm flex'>
              <a
                className='border-b border-dial-iris-blue'
                href={`mailto:${resource.submittedBy.email}`}
                target='_blank'
                rel='noreferrer'
              >
                {resource.submittedBy.email}
              </a>
            </div>
          </div>
        </>
      }
      <hr className='border-b border-dial-blue-chalk my-3' />
      <ResourceDetailCountries resource={resource} editingAllowed={editingAllowed} />
      <hr className='border-b border-dial-blue-chalk my-3' />
      <ResourceDetailTags resource={resource} editingAllowed={editingAllowed} />
    </div>
  )
}

export default ResourceDetailHeader
