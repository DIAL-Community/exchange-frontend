import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { FormattedDate, useIntl } from 'react-intl'
import { useUser } from '../../../lib/hooks'
import CommentsSection from '../../shared/comment/CommentsSection'
import Bookmark from '../../shared/common/Bookmark'
import Share from '../../shared/common/Share'
import EditButton from '../../shared/form/EditButton'
import { HtmlViewer } from '../../shared/form/HtmlViewer'
import { CandidateActionType, ObjectType } from '../../utils/constants'
import ResourceActionButton from './fragments/ResourceActionButton'

const ResourceDetailRight = forwardRef(({ candidateResource }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser, isEditorUser } = useUser()
  const canEdit = isAdminUser || isEditorUser

  const editPath = `${candidateResource.slug}/edit`

  const commentsSectionRef = useRef()
  useImperativeHandle(ref, () => ([
    { value: 'ui.comment.label', ref: commentsSectionRef }
  ]), [])

  return (
    <div className='px-4 lg:px-0 py-4 lg:py-6'>
      <div className='flex flex-col gap-y-3'>
        {canEdit && (
          <div className='flex gap-x-3 ml-auto'>
            <ResourceActionButton candidateResource={candidateResource} actionType={CandidateActionType.REJECT} />
            <ResourceActionButton candidateResource={candidateResource} actionType={CandidateActionType.APPROVE} />
            <EditButton type='link' href={editPath} />
          </div>
        )}
        <div className='text-xl font-semibold text-dial-meadow py-3'>
          {format('ui.common.detail.description')}
        </div>
        <div className='block'>
          <HtmlViewer
            initialContent={candidateResource?.description}
            editorId='resource-description'
          />
        </div>
        {candidateResource.resourceType &&
          <>
            <hr className='border-b border-dial-blue-chalk my-3' />
            <div className='flex flex-col gap-y-3'>
              <div className='font-semibold text-dial-meadow'>
                {format('ui.candidateResource.resourceType')}
              </div>
              <div className='my-auto text-sm'>
                {candidateResource.resourceType}
              </div>
            </div>
          </>
        }
        {candidateResource.submitterEmail &&
          <>
            <hr className='border-b border-dial-blue-chalk my-3' />
            <div className='flex flex-col gap-y-3'>
              <div className='font-semibold text-dial-meadow'>
                {format('ui.candidate.submitter')}
              </div>
              <div className='my-auto text-sm flex'>
                <a
                  className='border-b border-dial-iris-blue'
                  href={`mailto:${candidateResource.submitterEmail}`}
                  target='_blank'
                  rel='noreferrer'
                >
                  {candidateResource.submitterEmail}
                </a>
              </div>
              <div className='text-xs italic'>
                <span className='pr-[2px]'>{format('ui.candidate.submittedOn')}:</span>
                <FormattedDate value={candidateResource.createdAt} />
              </div>
            </div>
          </>
        }
        {`${candidateResource.rejected}` === 'true' &&
          <>
            <hr className='border-b border-dial-blue-chalk my-3' />
            <div className='flex flex-col gap-y-3'>
              <div className='font-semibold text-red-700'>
                {format('ui.candidate.rejectedBy')}
              </div>
              <div className='my-auto text-sm flex'>
                <a
                  className='border-b border-dial-iris-blue'
                  href={`mailto:${candidateResource.rejectedBy}`}
                  target='_blank'
                  rel='noreferrer'
                >
                  {candidateResource.rejectedBy}
                </a>
              </div>
              <div className='text-xs italic'>
                <span className='pr-[2px]'>{format('ui.candidate.rejectedOn')}:</span>
                <FormattedDate value={candidateResource.rejectedDate} />
              </div>
            </div>
          </>
        }
        {`${candidateResource.rejected}` === 'false' &&
          <>
            <hr className='border-b border-dial-blue-chalk my-3' />
            <div className='flex flex-col gap-y-3'>
              <div className='font-semibold text-green-700'>
                {format('ui.candidate.approvedBy')}
              </div>
              <div className='my-auto text-sm flex'>
                <a
                  className='border-b border-dial-iris-blue'
                  href={`mailto:${candidateResource.approvedBy}`}
                  target='_blank'
                  rel='noreferrer'
                >
                  {candidateResource.approvedBy}
                </a>
              </div>
              <div className='text-xs italic'>
                <span className='pr-[2px]'>{format('ui.candidate.approvedOn')}:</span>
                <FormattedDate value={candidateResource.approvedDate} />
              </div>
            </div>
          </>
        }
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='lg:hidden flex flex-col gap-y-3'>
          <Bookmark object={candidateResource} objectType={ObjectType.CANDIDATE_RESOURCE} />
          <hr className='border-b border-dial-slate-200'/>
          <Share />
          <hr className='border-b border-dial-slate-200'/>
        </div>
        <CommentsSection
          commentsSectionRef={commentsSectionRef}
          objectId={candidateResource.id}
          objectType={ObjectType.CANDIDATE_RESOURCE}
        />
      </div>
    </div>
  )
})

ResourceDetailRight.displayName = 'ResourceDetailRight'

export default ResourceDetailRight
