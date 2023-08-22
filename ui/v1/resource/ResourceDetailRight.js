import { useIntl } from 'react-intl'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { DisplayType, ObjectType } from '../utils/constants'
import EditButton from '../shared/form/EditButton'
import { HtmlViewer } from '../shared/form/HtmlViewer'
import { useUser } from '../../../lib/hooks'
import OrganizationCard from '../organization/OrganizationCard'
import CommentsSection from '../shared/comment/CommentsSection'
import DeleteResource from './DeleteResource'

const ResourceDetailRight = forwardRef(({ resource }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser, isEditorUser } = useUser()
  const canEdit = (isAdminUser || isEditorUser) && !resource.markdownUrl

  const descRef = useRef()
  const organizationRef = useRef()
  const commentsSectionRef = useRef()

  useImperativeHandle(
    ref,
    () => [
      { value: 'ui.common.detail.description', ref: descRef },
      { value: 'ui.organization.header', ref: organizationRef },
      { value: 'ui.comment.label', ref: commentsSectionRef }
    ],
    []
  )

  const editPath = `${resource.slug}/edit`

  return (
    <div className=' flex flex-col gap-y-4 px-4 lg:px-6 lg:py-2'>
      <div className='flex flex-col gap-y-3'>
        {canEdit && (
          <div className='flex gap-x-3 ml-auto'>
            <EditButton type='link' href={editPath} />
            {isAdminUser && <DeleteResource resource={resource} />}
          </div>
        )}
        <div className='text-xl font-semibold text-dial-plum py-3' ref={descRef}>
          {format('ui.common.detail.description')}
        </div>
        <div className='block'>
          <HtmlViewer
            initialContent={resource?.description}
            editorId='resource-description'
          />
        </div>
      </div>
      <hr className='border-b border-dial-blue-chalk mt-6' />
      <div className='flex flex-col gap-y-3'>
        <div className='text-xl font-semibold text-dial-plum py-3' ref={organizationRef}>
          {format('ui.organization.header')}
        </div>
        {resource?.organizations.length <= 0 &&
          <div className='text-sm text-dial-stratos'>
            {format('ui.common.detail.noData', {
              entity: format('ui.organization.label'),
              base: format('ui.resource.label')
            })}
          </div>
        }
        {resource?.organizations.length > 0 &&
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3'>
            {resource?.organizations?.map((organization, index) =>
              <div key={`organization-${index}`}>
                <OrganizationCard
                  index={index}
                  organization={organization}
                  displayType={DisplayType.SMALL_CARD}
                />
              </div>
            )}
          </div>
        }
      </div>
      <hr className='border-b border-dial-blue-chalk mt-6 mb-3' />
      <CommentsSection
        commentsSectionRef={commentsSectionRef}
        objectId={resource.id}
        objectType={ObjectType.RESOURCE}
      />
    </div>
  )
})

ResourceDetailRight.displayName = 'ResourceDetailRight'

export default ResourceDetailRight
