import { FormattedDate, useIntl } from 'react-intl'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { ObjectType } from '../../utils/constants'
import { HtmlViewer } from '../../shared/form/HtmlViewer'
import CommentsSection from '../../shared/comment/CommentsSection'

const RoleDetailRight = forwardRef(({ role }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const commentsSectionRef = useRef()
  useImperativeHandle(ref, () => ([
    { value: 'ui.comment.label', ref: commentsSectionRef }
  ]), [])

  return (
    <div className='px-4 lg:px-0 lg:py-2'>
      <div className='flex flex-col gap-y-3'>
        <div className='text-xl font-semibold text-dial-meadow py-3'>
          {format('ui.common.detail.description')}
        </div>
        <div className='block'>
          <HtmlViewer
            initialContent={role?.description}
            editorId='role-description'
          />
        </div>
      </div>
      {role.email &&
        <>
          <hr className='border-b border-dial-blue-chalk mt-6' />
          <div className='flex flex-col gap-y-3'>
            <div className='font-semibold text-dial-meadow'>
              {format('ui.candidate.submitter')}
            </div>
            <div className='my-auto text-sm flex'>
              <a
                className='border-b border-dial-iris-blue'
                href={`mailto:${role.email}`}
                target='_blank'
                rel='noreferrer'
              >
                {role.email}
              </a>
            </div>
            <div className='text-xs italic'>
              <span className='pr-[2px]'>{format('ui.candidate.submittedOn')}:</span>
              <FormattedDate value={role.createdAt} />
            </div>
          </div>
        </>
      }
      {`${role.rejected}` === 'true' &&
        <>
          <hr className='border-b border-dial-blue-chalk mt-6' />
          <div className='flex flex-col gap-y-3'>
            <div className='font-semibold text-red-700'>
              {format('ui.candidate.rejectedBy')}
            </div>
            <div className='my-auto text-sm flex'>
              <a
                className='border-b border-dial-iris-blue'
                href={`mailto:${role.rejectedBy}`}
                target='_blank'
                rel='noreferrer'
              >
                {role.rejectedBy}
              </a>
            </div>
            <div className='text-xs italic'>
              <span className='pr-[2px]'>{format('ui.candidate.rejectedOn')}:</span>
              <FormattedDate value={role.rejectedDate} />
            </div>
          </div>
        </>
      }
      {`${role.rejected}` === 'false' &&
        <>
          <hr className='border-b border-dial-blue-chalk mt-6' />
          <div className='flex flex-col gap-y-3'>
            <div className='font-semibold text-green-700'>
              {format('ui.candidate.approvedBy')}
            </div>
            <div className='my-auto text-sm flex'>
              <a
                className='border-b border-dial-iris-blue'
                href={`mailto:${role.approvedBy}`}
                target='_blank'
                rel='noreferrer'
              >
                {role.approvedBy}
              </a>
            </div>
            <div className='text-xs italic'>
              <span className='pr-[2px]'>{format('ui.candidate.approvedOn')}:</span>
              <FormattedDate value={role.approvedDate} />
            </div>
          </div>
        </>
      }
      <hr className='border-b border-dial-blue-chalk mt-6 mb-3' />
      <CommentsSection
        commentsSectionRef={commentsSectionRef}
        objectId={role.id}
        objectType={ObjectType.CANDIDATE_ROLE}
      />
    </div>
  )
})

RoleDetailRight.displayName = 'RoleDetailRight'

export default RoleDetailRight
