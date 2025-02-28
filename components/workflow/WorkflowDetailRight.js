import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { useIntl } from 'react-intl'
import CommentsSection from '../shared/comment/CommentsSection'
import Bookmark from '../shared/common/Bookmark'
import Share from '../shared/common/Share'
import EditButton from '../shared/form/EditButton'
import { HtmlViewer } from '../shared/form/HtmlViewer'
import UseCaseCard from '../use-case/UseCaseCard'
import { DisplayType, ObjectType } from '../utils/constants'
import DeleteWorkflow from './fragments/DeleteWorkflow'
import WorkflowDetailBuildingBlocks from './fragments/WorkflowDetailBuildingBlocks'

const WorkflowUseCases = ({ workflow, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-3'>
      <div className='text-lg font-semibold text-dial-plum' ref={headerRef}>
        {format('ui.useCase.header')}
      </div>
      <div className='grid grid-cols-1 gap-y-3'>
        {workflow.useCases.length > 0
          ?workflow.useCases.map((useCase, index) => (
            <div key={index}>
              <UseCaseCard useCase={useCase} displayType={DisplayType.SMALL_CARD} />
            </div>
          ))
          : <div className='text-sm text-dial-stratos'>
            {format('ui.common.detail.noData', {
              entity: format('ui.useCase.label'),
              base: format('ui.workflow.label')
            })}
          </div>
        }
      </div>
    </div>
  )
}

const WorkflowDetailRight = forwardRef(({ workflow, editingAllowed, deletingAllowed }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const descRef = useRef()
  const useCaseRef = useRef()
  const buildingBlockRef = useRef()
  const commentsSectionRef = useRef()

  useImperativeHandle(
    ref,
    () => [
      { value: 'ui.common.detail.description', ref: descRef },
      { value: 'ui.useCase.header', ref: useCaseRef },
      { value: 'ui.buildingBlock.header', ref: buildingBlockRef },
      { value: 'ui.comment.label', ref: commentsSectionRef }
    ],
    []
  )

  const editPath = `${workflow.slug}/edit`

  return (
    <div className='px-4 lg:px-0 py-4 lg:py-6'>
      <div className='flex flex-col gap-y-3'>
        <div className='flex gap-x-3 ml-auto'>
          { editingAllowed && (<EditButton type='link' href={editPath} />) }
          { deletingAllowed && <DeleteWorkflow workflow={workflow} /> }
        </div>
        <div className='text-xl font-semibold text-dial-plum py-3' ref={descRef}>
          {format('ui.common.detail.description')}
        </div>
        <div className='description-block'>
          <HtmlViewer
            initialContent={workflow?.workflowDescription?.description}
            editorId='workflow-description'
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <WorkflowUseCases workflow={workflow} headerRef={useCaseRef} />
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <WorkflowDetailBuildingBlocks
            workflow={workflow}
            editingAllowed={editingAllowed}
            headerRef={buildingBlockRef}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='lg:hidden flex flex-col gap-y-3'>
          <Bookmark object={workflow} objectType={ObjectType.WORKFLOW} />
          <hr className='border-b border-dial-slate-200'/>
          <Share />
          <hr className='border-b border-dial-slate-200'/>
        </div>
        <CommentsSection
          commentsSectionRef={commentsSectionRef}
          objectId={workflow.id}
          objectType={ObjectType.WORKFLOW}
        />
      </div>
    </div>
  )
})

WorkflowDetailRight.displayName = 'WorkflowDetailRight'

export default WorkflowDetailRight
