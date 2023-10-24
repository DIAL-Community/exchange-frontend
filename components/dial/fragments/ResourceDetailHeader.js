import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useUser } from '../../../lib/hooks'
import { prependUrlWithProtocol } from '../../utils/utilities'
import ResourceDetailTags from './ResourceDetailTags'
import ResourceDetailCountries from './ResourceDetailCountries'

const ResourceDetailHeader = ({ resource }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser, isEditorUser } = useUser()
  const canEdit = isAdminUser || isEditorUser

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      <div className='text-dial-stratos font-semibold'>
        {format('ui.resource.authorName')}
      </div>
      {resource?.authors.map((author, index) =>
        <div key={index} className='flex flex-row items-center gap-3'>
          <img
            src='/ui/v1/author-header.svg'
            className='badge-avatar w-10 h-10'
            alt='Author picture'
          />
          <div className='text-dial-stratos'>
            {author?.name}
          </div>
        </div>
      )}
      <hr className='border-b border-dial-blue-chalk my-3' />
      <div className='flex flex-col gap-y-2'>
        <div className='font-semibold text-dial-stratos'>
          {format('ui.resource.resourceLink')}
        </div>
        <div className='flex text-dial-stratos'>
          <a
            href={prependUrlWithProtocol(resource.resourceLink)}
            target='_blank'
            rel='noreferrer'
            className='flex border-b border-dial-iris-blue '>
            <div className='line-clamp-1 break-all'>
              {resource.linkDesc ? resource.linkDesc : resource.resourceLink}
            </div>
          </a>
          &nbsp;⧉
        </div>
      </div>
      <hr className='border-b border-dial-blue-chalk my-3' />
      <ResourceDetailCountries resource={resource} canEdit={canEdit} />
      <hr className='border-b border-dial-blue-chalk my-3' />
      <ResourceDetailTags resource={resource} canEdit={canEdit} />
    </div>
  )
}

export default ResourceDetailHeader
