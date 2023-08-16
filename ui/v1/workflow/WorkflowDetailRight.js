import { useIntl } from 'react-intl'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { DisplayType, ObjectType } from '../utils/constants'
import EditButton from '../shared/form/EditButton'
import { HtmlViewer } from '../shared/form/HtmlViewer'
import { useUser } from '../../../lib/hooks'
import UseCaseCard from '../use-case/UseCaseCard'
import CommentsSection from '../shared/comment/CommentsSection'
import DeleteWorkflow from './DeleteWorkflow'
import WorkflowDetailBuildingBlocks from './fragments/WorkflowDetailBuildingBlocks'

const WorkflowUseCases = ({ workflow, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-3'>
      <div className='text-lg font-semibold text-dial-meadow' ref={headerRef}>
        {format('ui.useCase.header')}
      </div>
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-x-3 gap-y-12 xl:gap-y-0'>
        {workflow.useCases.length > 0 ? (
          workflow.useCases.map((useCase, index) => (
            <div key={index} className='pb-5 mr-6'>
              <UseCaseCard useCase={useCase} displayType={DisplayType.SMALL_CARD} />
            </div>
          ))
        ) : (
          <div className='text-sm text-dial-stratos'>
            {format('ui.common.detail.noData', {
              entity: format('ui.useCase.label'),
              base: format('ui.workflow.label')
            })}
          </div>
        )}
      </div>
    </div>
  )
}

const WorkflowDetailRight = forwardRef(({ workflow, commentsSectionRef }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser, isEditorUser } = useUser()
  const canEdit = (isAdminUser || isEditorUser) && !workflow.markdownUrl

  const descRef = useRef()
  const useCaseRef = useRef()
  const buildingBlockRef = useRef()

  useImperativeHandle(
    ref,
    () => [
      { value: 'ui.common.detail.description', ref: descRef },
      { value: 'ui.useCase.header', ref: useCaseRef },
      { value: 'ui.buildingBlock.header', ref: buildingBlockRef }
    ],
    []
  )

  const editPath = `${workflow.slug}/edit`

  return (
    <div className=' flex flex-col gap-y-4 px-4 lg:px-6 lg:py-2'>
      <div className='flex flex-col gap-y-3'>
        {canEdit && (
          <div className='flex gap-x-3 ml-auto'>
            <EditButton type='link' href={editPath} />
            {isAdminUser && <DeleteWorkflow workflow={workflow} />}
          </div>
        )}
        <div className='text-xl font-semibold text-dial-plum py-3' ref={descRef}>
          {format('ui.common.detail.description')}
        </div>
        <div className='block'>
          <HtmlViewer
            initialContent={workflow?.workflowDescription?.description}
            editorId='workflow-description'
          />
        </div>
      </div>
      <hr className='bg-dial-blue-chalk mt-6' />
      <WorkflowUseCases workflow={workflow} headerRef={useCaseRef} />
      <hr className='bg-dial-blue-chalk mt-6' />
      <div className='flex flex-col gap-y-3'>
        <WorkflowDetailBuildingBlocks
          workflow={workflow}
          canEdit={canEdit}
          headerRef={buildingBlockRef}
        />
      </div>
      <hr className='bg-dial-blue-chalk mt-6 mb-3' />
      <CommentsSection
        commentsSectionRef={commentsSectionRef}
        objectId={workflow.id}
        objectType={ObjectType.WORKFLOW}
      />
    </div>
  )
})

WorkflowDetailRight.displayName = 'WorkflowDetailRight'

export default WorkflowDetailRight
