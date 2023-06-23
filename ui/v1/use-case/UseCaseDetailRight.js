import { useIntl } from 'react-intl'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import WorkflowCard from '../workflow/WorkflowCard'
import { DisplayType } from '../utils/constants'
import BuildingBlockCard from '../building-block/BuildingBlockCard'
import { HtmlViewer } from '../shared/form/HtmlViewer'
import { useUser } from '../../../lib/hooks'
import UseCaseDetailSdgTargets from './fragments/UseCaseDetailSdgTargets'
import UseCaseDetailTags from './fragments/UseCaseDetailSdgTags'

const UseCaseDetailRight = forwardRef(({ useCase }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser, isEditorUser } = useUser()
  const canEdit = (isAdminUser || isEditorUser) && !useCase.markdownUrl

  const descRef = useRef()
  const stepRef = useRef()
  const workflowRef = useRef()
  const sdgTargetRef = useRef()
  const buildingBlockRef = useRef()
  const tagRef = useRef()

  useImperativeHandle(ref, () => ([
    { value: 'ui.common.detail.description', ref: descRef },
    { value: 'ui.useCase.detail.steps', ref: stepRef },
    { value: 'ui.workflow.header', ref: workflowRef },
    { value: 'ui.sdgTarget.header', ref: sdgTargetRef },
    { value: 'ui.buildingBlock.header', ref: buildingBlockRef },
    { value: 'ui.tag.header', ref: tagRef }
  ]), [])

  return (
    <div className='flex flex-col gap-y-4 py-8 px-6'>
      <div className='flex flex-col gap-y-3'>
        <div className='text-xl font-semibold text-dial-blueberry py-3' ref={descRef}>
          {format('ui.common.detail.description')}
        </div>
        <div className='block'>
          <HtmlViewer
            initialContent={useCase?.useCaseDescription?.description}
            editorId='use-case-description'
          />
        </div>
      </div>
      <hr className='bg-dial-blue-chalk'/>
      <div className='flex flex-col gap-y-3'>
        <div className='text-xl font-semibold text-dial-blueberry py-3' ref={stepRef}>
          {format('ui.useCase.detail.steps')}
        </div>
        <div className='flex flex-col gap-y-3'>
          {useCase?.useCaseSteps?.map((useCaseStep, index) =>
            <div key={index} className='rounded-md bg-dial-cotton'>
              <div className='flex flex-col gap-y-3 text-dial-blueberry px-6 py-4'>
                <div className='text-base'>
                  {`${index + 1}. ${useCaseStep.name}`}
                </div>
                <div className='flex gap-x-2 text-xs text-dial-stratos'>
                  <div className='text-sm'>
                    {format('ui.workflow.header')} ({useCaseStep.workflows?.length ?? 0})
                  </div>
                  <div className='border border-r border-dial-slate-300' />
                  <div className='text-sm'>
                    {format('ui.buildingBlock.header')} ({useCaseStep.buildingBlocks?.length ?? 0})
                  </div>
                  <div className='border border-r border-dial-slate-300' />
                  <div className='text-sm'>
                    {format('ui.product.header')} ({useCaseStep.product?.length ?? 0})
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <hr className='bg-dial-blue-chalk mt-6'/>
      <div className='flex flex-col gap-y-3'>
        <div className='text-xl font-semibold text-dial-blueberry py-3' ref={workflowRef}>
          {format('ui.workflow.header')}
        </div>
        <div className='grid grid-cols-2 gap-x-8 gap-y-4'>
          {useCase?.workflows?.map((workflow, index) =>
            <div key={`workflow-${index}`}>
              <WorkflowCard
                index={index}
                workflow={workflow}
                displayType={DisplayType.SMALL_CARD}
              />
            </div>
          )}
        </div>
      </div>
      <hr className='bg-dial-blue-chalk mt-6'/>
      <div className='flex flex-col gap-y-3'>
        <UseCaseDetailSdgTargets useCase={useCase} canEdit={canEdit} headerRef={sdgTargetRef}/>
      </div>
      <hr className='bg-dial-blue-chalk mt-6'/>
      <div className='flex flex-col gap-y-3'>
        <div className='text-xl font-semibold text-dial-blueberry py-3' ref={buildingBlockRef}>
          {format('ui.buildingBlock.header')}
        </div>
        <div className='grid grid-cols-2 gap-x-8 gap-y-4'>
          {useCase?.buildingBlocks?.map((buildingBlock, index) =>
            <div key={`building-block-${index}`}>
              <BuildingBlockCard
                index={index}
                buildingBlock={buildingBlock}
                displayType={DisplayType.SMALL_CARD}
              />
            </div>
          )}
        </div>
      </div>
      <hr className='bg-dial-blue-chalk mt-6'/>
      <div className='flex flex-col gap-y-3'>
        <UseCaseDetailTags useCase={useCase} canEdit={canEdit} headerRef={tagRef} />
      </div>
    </div>
  )
})

UseCaseDetailRight.displayName = 'UseCaseDetailRight'

export default UseCaseDetailRight
