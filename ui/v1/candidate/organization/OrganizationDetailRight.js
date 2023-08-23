import { FormattedDate, useIntl } from 'react-intl'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { ObjectType } from '../../utils/constants'
import EditButton from '../../shared/form/EditButton'
import { HtmlViewer } from '../../shared/form/HtmlViewer'
import { useUser } from '../../../../lib/hooks'
import CommentsSection from '../../shared/comment/CommentsSection'

const OrganizationDetailRight = forwardRef(({ organization }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser, isEditorUser } = useUser()
  const canEdit = (isAdminUser || isEditorUser) && !organization.markdownUrl

  const editPath = `${organization.slug}/edit`
  const [submitter] = organization.contacts

  const commentsSectionRef = useRef()
  useImperativeHandle(ref, () => ([
    { value: 'ui.comment.label', ref: commentsSectionRef }
  ]), [])

  return (
    <div className='px-4 lg:px-0 py-4 lg:py-6'>
      <div className='flex flex-col gap-y-3'>
        {canEdit && (
          <div className='flex gap-x-3 ml-auto'>
            <EditButton type='link' href={editPath} />
          </div>
        )}
        <div className='text-xl font-semibold text-dial-plum py-3'>
          {format('ui.common.detail.description')}
        </div>
        <div className='block'>
          <HtmlViewer
            initialContent={organization?.description}
            editorId='organization-description'
          />
        </div>
        {submitter?.email &&
          <>
            <hr className='border-b border-dial-blue-chalk my-3' />
            <div className='flex flex-col gap-y-3'>
              <div className='font-semibold text-dial-meadow'>
                {format('ui.candidate.submitter')}
              </div>
              <div className='text-sm'>
                {submitter.name}
              </div>
              <div className='text-sm flex'>
                <a
                  className='border-b border-dial-iris-blue'
                  href={`mailto:${submitter.email}`}
                  target='_blank'
                  rel='noreferrer'
                >
                  {submitter.email}
                </a>
              </div>
              <div className='text-xs italic'>
                <span className='pr-[2px]'>{format('ui.candidate.submittedOn')}:</span>
                <FormattedDate value={organization.createdAt} />
              </div>
            </div>
          </>
        }
        {`${organization.rejected}` === 'true' &&
          <>
            <hr className='border-b border-dial-blue-chalk my-3' />
            <div className='flex flex-col gap-y-3'>
              <div className='font-semibold text-red-700'>
                {format('ui.candidate.rejectedBy')}
              </div>
              <div className='my-auto text-sm flex'>
                <a
                  className='border-b border-dial-iris-blue'
                  href={`mailto:${organization.rejectedBy}`}
                  target='_blank'
                  rel='noreferrer'
                >
                  {organization.rejectedBy}
                </a>
              </div>
              <div className='text-xs italic'>
                <span className='pr-[2px]'>{format('ui.candidate.rejectedOn')}:</span>
                <FormattedDate value={organization.rejectedDate} />
              </div>
            </div>
          </>
        }
        {`${organization.rejected}` === 'false' &&
          <>
            <hr className='border-b border-dial-blue-chalk my-3' />
            <div className='flex flex-col gap-y-3'>
              <div className='font-semibold text-green-700'>
                {format('ui.candidate.approvedBy')}
              </div>
              <div className='my-auto text-sm flex'>
                <a
                  className='border-b border-dial-iris-blue'
                  href={`mailto:${organization.approvedBy}`}
                  target='_blank'
                  rel='noreferrer'
                >
                  {organization.approvedBy}
                </a>
              </div>
              <div className='text-xs italic'>
                <span className='pr-[2px]'>{format('ui.candidate.approvedOn')}:</span>
                <FormattedDate value={organization.approvedDate} />
              </div>
            </div>
          </>
        }
        <hr className='border-b border-dial-blue-chalk my-3' />
        <CommentsSection
          commentsSectionRef={commentsSectionRef}
          objectId={organization.id}
          objectType={ObjectType.CANDIDATE_ORGANIZATION}
        />
      </div>
    </div>
  )
})

OrganizationDetailRight.displayName = 'OrganizationDetailRight'

export default OrganizationDetailRight
