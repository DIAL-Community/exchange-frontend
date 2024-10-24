import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { FormattedDate, FormattedTime, useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { EDITING_POLICY_SLUG, GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import CommentsSection from '../shared/comment/CommentsSection'
import Bookmark from '../shared/common/Bookmark'
import Share from '../shared/common/Share'
import EditButton from '../shared/form/EditButton'
import { HtmlViewer } from '../shared/form/HtmlViewer'
import { TASK_TRACKER_POLICY_QUERY } from '../shared/query/taskTracker'
import { ObjectType } from '../utils/constants'
import DeleteTaskTracker from './DeleteTaskTracker'

const TaskTrackerDetailRight = forwardRef(({ taskTracker }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const descRef = useRef()
  const commentsSectionRef = useRef()

  useImperativeHandle(
    ref,
    () => [
      { value: 'ui.common.detail.description', ref: descRef },
      { value: 'ui.comment.label', ref: commentsSectionRef }
    ],
    []
  )

  const editPath = `${taskTracker.slug}/edit`

  let editingAllowed = false
  const { error } = useQuery(TASK_TRACKER_POLICY_QUERY, {
    variables: { slug: EDITING_POLICY_SLUG },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.EDITING
      }
    }
  })

  if (!error) {
    editingAllowed = true
  }

  return (
    <div className='px-4 lg:px-0 py-4 lg:py-6'>
      <div className='flex flex-col gap-y-3'>
        <div className='flex gap-x-3 ml-auto'>
          { editingAllowed && <EditButton type='link' href={editPath} /> }
          <DeleteTaskTracker taskTracker={taskTracker} />
        </div>
        <div className='text-xl font-semibold text-dial-stratos pb-3' ref={descRef}>
          {format('ui.common.detail.description')}
        </div>
        <div className='block'>
          <HtmlViewer
            initialContent={taskTracker?.taskTrackerDescription?.description}
            editorId='taskTracker-description'
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3 text-dial-stratos'>
          <div className='font-semibold'>
            {format('ui.taskTracker.lastReceivedMessage')}
          </div>
          <div className='text-sm'>
            {taskTracker.lastReceivedMessage}
          </div>
        </div>
        {`${taskTracker.taskCompleted}` === 'false' &&
          <>
            <hr className='border-b border-dial-blue-chalk my-3' />
            <div className='flex flex-col gap-y-3'>
              <div className='font-semibold text-red-700'>
                {format('ui.taskTracker.incomplete')}
              </div>
              <div className='text-xs italic'>
                <span className='pr-[2px]'>{format('ui.taskTracker.lastStartedDate')}:</span>
                <FormattedDate value={taskTracker.lastStartedDate} />
                &nbsp;
                <FormattedTime value={taskTracker.lastStartedDate} />
              </div>
            </div>
          </>
        }
        {`${taskTracker.taskCompleted}` === 'true' &&
          <>
            <hr className='border-b border-dial-blue-chalk my-3' />
            <div className='flex flex-col gap-y-3'>
              <div className='font-semibold text-green-700'>
                {format('ui.taskTracker.complete')}
              </div>
              <div className='text-xs italic'>
                <span className='pr-[2px]'>{format('ui.taskTracker.lastStartedDate')}:</span>
                <FormattedDate value={taskTracker.lastStartedDate} />
                &nbsp;
                <FormattedTime value={taskTracker.lastStartedDate} />
              </div>
            </div>
          </>
        }
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='lg:hidden flex flex-col gap-y-3'>
          <Bookmark object={taskTracker} objectType={ObjectType.TASK} />
          <hr className='border-b border-dial-slate-200'/>
          <Share />
          <hr className='border-b border-dial-slate-200'/>
        </div>
        <CommentsSection
          commentsSectionRef={commentsSectionRef}
          objectId={taskTracker.id}
          objectType={ObjectType.TASK}
        />
      </div>
    </div>
  )
})

TaskTrackerDetailRight.displayName = 'TaskTrackerDetailRight'

export default TaskTrackerDetailRight
