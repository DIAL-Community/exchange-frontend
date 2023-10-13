import { useIntl } from 'react-intl'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { ObjectType } from '../utils/constants'
import EditButton from '../shared/form/EditButton'
import { HtmlViewer } from '../shared/form/HtmlViewer'
import { useUser } from '../../lib/hooks'
import Share from '../shared/common/Share'
import Bookmark from '../shared/common/Bookmark'
import CommentsSection from '../shared/comment/CommentsSection'
import { prependUrlWithProtocol } from '../utils/utilities'
import DeleteResource from './DeleteResource'

const ResourceDetailLeft = forwardRef(({ resource }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser, isEditorUser } = useUser()
  const canEdit = isAdminUser || isEditorUser

  const titleRef = useRef()
  const commentsSectionRef = useRef()

  useImperativeHandle(
    ref,
    () => [
      { value: 'ui.common.scrollToTop', ref: titleRef },
      { value: 'ui.comment.label', ref: commentsSectionRef }
    ],
    []
  )

  const editPath = `${resource.slug}/edit`

  return (
    <div className='px-4 lg:px-0 py-4 lg:py-6'>
      <div className='flex flex-col gap-y-3'>
        <div className='flex items-center gap-6'>
          <div className='bg-dial-acid text-sm px-5 py-2 rounded-md shadow-lg'>
            {format(resource.resourceTopic ?? 'ui.resource.topic.unspecified')}
          </div>
          <div className='text-sm'>
            {format(resource.resourceType ?? 'ui.resource.type.unspecified')}
          </div>
          {canEdit && (
            <div className='flex gap-x-3 ml-auto'>
              <EditButton type='link' href={editPath} />
              {isAdminUser && <DeleteResource resource={resource} />}
            </div>
          )}
        </div>
        <div className='text-4xl font-semibold text-dial-stratos py-3' ref={titleRef}>
          {resource?.name}
        </div>
        <div className='block'>
          <HtmlViewer
            initialContent={resource?.description}
            editorId='resource-description'
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <div className='text-xl font-semibold text-dial-stratos pb-3'>
            {format('ui.resource.resourceLink')}
          </div>
          <div className='flex text-dial-stratos'>
            <a
              href={prependUrlWithProtocol(resource.resourceLink)}
              target='_blank'
              rel='noreferrer'
              className='flex border-b border-dial-iris-blue '>
              <div className='line-clamp-1 break-all'>
                {resource.resourceLink}
              </div>
            </a>
            &nbsp;⧉
          </div>
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='lg:hidden flex flex-col gap-y-3'>
          <Bookmark object={resource} objectType={ObjectType.RESOURCE} />
          <hr className='border-b border-dial-slate-200'/>
          <Share />
          <hr className='border-b border-dial-slate-200'/>
        </div>
        <CommentsSection
          commentsSectionRef={commentsSectionRef}
          objectId={resource.id}
          objectType={ObjectType.RESOURCE}
        />
      </div>
    </div>
  )
})

ResourceDetailLeft.displayName = 'ResourceDetailLeft'

export default ResourceDetailLeft
