import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import Link from 'next/link'
import { useIntl } from 'react-intl'
import { useUser } from '../../lib/hooks'
import CommentsSection from '../shared/comment/CommentsSection'
import Bookmark from '../shared/common/Bookmark'
import Share from '../shared/common/Share'
import EditButton from '../shared/form/EditButton'
import { HtmlViewer } from '../shared/form/HtmlViewer'
import { ObjectType } from '../utils/constants'
import DeleteCandidateStatus from './DeleteCandidateStatus'

const CandidateStatusDetailRight = forwardRef(({ candidateStatus }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser, isEditorUser } = useUser()
  const canEdit = isAdminUser || isEditorUser

  const commentsSectionRef = useRef()
  useImperativeHandle(ref, () => [{ value: 'ui.comment.label', ref: commentsSectionRef }], [])

  const editPath = `${candidateStatus.slug}/edit`

  return (
    <div className='px-4 lg:px-0 py-4 lg:py-6'>
      <div className='flex flex-col gap-y-3'>
        <div className='flex flex-col gap-y-3 lg:flex-row gap-x-3'>
          {candidateStatus.terminalStatus &&
            <span className='bg-dial-plum text-white px-2 py-2 rounded text-xs'>
              {format('ui.candidateStatus.terminalStatus.label')}
            </span>
          }
          {candidateStatus.initialStatus &&
            <span className='bg-dial-iris-blue text-white px-3 py-2 rounded text-xs'>
              {format('ui.candidateStatus.initialStatus.label')}
            </span>
          }
          {canEdit && (
            <div className='flex gap-x-3 ml-auto'>
              <EditButton type='link' href={editPath} />
              {isAdminUser && <DeleteCandidateStatus candidateStatus={candidateStatus} />}
            </div>
          )}
        </div>
        <div className='text-base font-semibold py-3'>
          {format('ui.common.detail.description')}
        </div>
        <div className='block'>
          <HtmlViewer
            initialContent={candidateStatus?.description}
            editorId='candidate-status-description'
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <div className='text-base font-semibold'>
            {format('ui.candidateStatus.nextCandidateStatus.header')}
          </div>
          <div className='flex flex-col gap-4'>
            {candidateStatus?.nextCandidateStatuses.length <= 0 && format('general.na')}
            <div className='flex flex-col gap-1 text-sm'>
              {candidateStatus?.nextCandidateStatuses?.map((nextCandidateStatus, index) =>
                <div key={index} className='flex flex-col gap-1'>
                  <div className='border shadow px-4 py-3 flex gap-1'>
                    <Link href={`/candidate-statuses/${nextCandidateStatus.slug}`}>
                      {nextCandidateStatus.name}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='lg:hidden flex flex-col gap-y-3'>
          <Bookmark object={candidateStatus} objectType={ObjectType.CANDIDATE_STATUS} />
          <hr className='border-b border-dial-slate-200' />
          <Share />
          <hr className='border-b border-dial-slate-200' />
        </div>
        <CommentsSection
          commentsSectionRef={commentsSectionRef}
          objectId={candidateStatus.id}
          objectType={ObjectType.CANDIDATE_STATUS}
        />
      </div>
    </div>
  )
})

CandidateStatusDetailRight.displayName = 'CandidateStatusDetailRight'

export default CandidateStatusDetailRight
