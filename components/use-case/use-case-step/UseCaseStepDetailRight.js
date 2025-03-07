import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { useIntl } from 'react-intl'
import EditButton from '../../shared/form/EditButton'
import { HtmlViewer } from '../../shared/form/HtmlViewer'
import UseCaseStepDetailBuildingBlocks from './fragments/UseCaseStepDetailBuildingBlocks'
import UseCaseStepDetailDatasets from './fragments/UseCaseStepDetailDatasets'
import UseCaseStepDetailProducts from './fragments/UseCaseStepDetailProducts'
import UseCaseStepDetailWorkflows from './fragments/UseCaseStepDetailWorkflows'

const UseCaseStepDetailRight = forwardRef(({ useCase, useCaseStep, editingAllowed }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const descRef = useRef()
  const datasetRef = useRef()
  const productRef = useRef()
  const workflowRef = useRef()
  const buildingBlockRef = useRef()

  useImperativeHandle(ref, () => ([
    { value: 'ui.common.detail.description', ref: descRef },
    { value: 'ui.dataset.header', ref: datasetRef },
    { value: 'ui.product.header', ref: productRef },
    { value: 'ui.workflow.header', ref: workflowRef },
    { value: 'ui.buildingBlock.header', ref: buildingBlockRef }
  ]), [])

  return (
    <div className='px-4 lg:px-0 py-4 lg:py-6'>
      <div className='flex flex-col gap-y-3'>
        {!useCase.markdownUrl && editingAllowed &&
          <div className='flex gap-x-3 ml-auto'>
            <EditButton
              type='link'
              href={
                `/use-cases/${useCase.slug}` +
                `/use-case-steps/${useCaseStep.slug}/edit`
              }
            />
          </div>
        }
        <div className='text-xl font-semibold text-dial-blueberry py-3' ref={descRef}>
          {format('ui.common.detail.description')}
        </div>
        <div className='description-block'>
          <HtmlViewer
            initialContent={useCaseStep?.useCaseStepDescription?.description}
            editorId='use-case-step-description'
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3'/>
        <div className='flex flex-col gap-y-3'>
          <UseCaseStepDetailDatasets
            useCaseStep={useCaseStep}
            editingAllowed={!useCase.markdownUrl && editingAllowed}
            headerRef={datasetRef}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3'/>
        <div className='flex flex-col gap-y-3'>
          <UseCaseStepDetailProducts
            useCaseStep={useCaseStep}
            editingAllowed={!useCase.markdownUrl && editingAllowed}
            headerRef={productRef}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3'/>
        <div className='flex flex-col gap-y-3'>
          <UseCaseStepDetailWorkflows
            useCaseStep={useCaseStep}
            editingAllowed={!useCase.markdownUrl && editingAllowed}
            headerRef={workflowRef}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3'/>
        <div className='flex flex-col gap-y-3'>
          <UseCaseStepDetailBuildingBlocks
            useCase={useCase}
            useCaseStep={useCaseStep}
            editingAllowed={!useCase.markdownUrl && editingAllowed}
            headerRef={buildingBlockRef}
          />
        </div>
      </div>
    </div>
  )
})

UseCaseStepDetailRight.displayName = 'UseCaseStepDetailRight'

export default UseCaseStepDetailRight
