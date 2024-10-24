import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { FormattedDate, useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { EDITING_POLICY_SLUG, GRAPH_QUERY_CONTEXT } from '../../../../../lib/apolloClient'
import { HtmlViewer } from '../../../../shared/form/HtmlViewer'
import { CANDIDATE_ROLE_DETAIL_QUERY } from '../../../../shared/query/candidateRole'
import { CandidateActionType, ObjectType } from '../../../../utils/constants'
import Bookmark from '../../../shared/Bookmark'
import CommentsSection from '../../../shared/comment/CommentsSection'
import Share from '../../../shared/Share'
import RoleActionButton from './RoleActionButton'

const RoleDetailRight = forwardRef(({ role }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const commentsSectionRef = useRef()
  useImperativeHandle(ref, () => ([
    { value: 'ui.comment.label', ref: commentsSectionRef }
  ]), [])

  let editingAllowed = true
  const { error } = useQuery(CANDIDATE_ROLE_DETAIL_QUERY, {
    variables: { slug: EDITING_POLICY_SLUG },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.EDITING
      }
    }
  })

  if (error) {
    editingAllowed = false
  }

  return (
    <div className='px-4 lg:px-0 py-4 lg:py-6'>
      <div className='flex flex-col gap-y-3'>
        {editingAllowed && (
          <div className='flex gap-x-3 ml-auto'>
            <RoleActionButton role={role} actionType={CandidateActionType.REJECT} />
            <RoleActionButton role={role} actionType={CandidateActionType.APPROVE} />
          </div>
        )}
        <div className='text-xl font-semibold text-health-blue py-3'>
          {format('ui.common.detail.description')}
        </div>
        <div className='block'>
          <HtmlViewer
            initialContent={role?.description}
            editorId='role-description'
          />
        </div>
        {role.email &&
          <>
            <hr className='border-b border-dial-blue-chalk my-3' />
            <div className='flex flex-col gap-y-3'>
              <div className='font-semibold text-health-blue'>
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
            <hr className='border-b border-dial-blue-chalk my-3' />
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
            <hr className='border-b border-dial-blue-chalk my-3' />
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
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='lg:hidden flex flex-col gap-y-3'>
          <Bookmark object={role} objectType={ObjectType.CANDIDATE_ROLE} />
          <hr className='border-b border-dial-slate-200'/>
          <Share />
          <hr className='border-b border-dial-slate-200'/>
        </div>
        <CommentsSection
          commentsSectionRef={commentsSectionRef}
          objectId={role.id}
          objectType={ObjectType.CANDIDATE_ROLE}
        />
      </div>
    </div>
  )
})

RoleDetailRight.displayName = 'RoleDetailRight'

export default RoleDetailRight
