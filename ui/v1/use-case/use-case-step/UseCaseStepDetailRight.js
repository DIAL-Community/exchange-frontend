import { useIntl } from 'react-intl'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { useUser } from '../../../../lib/hooks'
import { HtmlViewer } from '../../shared/form/HtmlViewer'
import UseCaseStepDetailDatasets from './fragments/UseCaseStepDetailDatasets'
import UseCaseStepDetailProducts from './fragments/UseCaseStepDetailProducts'
import UseCaseStepDetailWorkflows from './fragments/UseCaseStepDetailWorkflows'
import UseCaseStepDetailBuildingBlocks from './fragments/UseCaseStepDetailBuildingBlocks'

const UseCaseStepDetailRight = forwardRef(({ useCase, useCaseStep }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const descRef = useRef()
  const datasetRef = useRef()
  const productRef = useRef()
  const workflowRef = useRef()
  const buildingBlockRef = useRef()

  const { isAdminUser, isEditorUser } = useUser()
  const canEdit = (isAdminUser || isEditorUser) && !useCase.markdownUrl

  useImperativeHandle(ref, () => ([
    { value: 'ui.common.detail.description', ref: descRef },
    { value: 'ui.dataset.header', ref: datasetRef },
    { value: 'ui.product.header', ref: productRef },
    { value: 'ui.workflow.header', ref: workflowRef },
    { value: 'ui.buildingBlock.header', ref: buildingBlockRef }
  ]), [])

  return (
    <div className='flex flex-col gap-y-4 py-8 px-6'>
      <div className='flex flex-col gap-y-3'>
        <div className='text-xl font-semibold text-dial-blueberry py-3' ref={descRef}>
          {format('ui.common.detail.description')}
        </div>
        <div className='block'>
          <HtmlViewer
            initialContent={useCaseStep?.useCaseStepDescription?.description}
            editorId='use-case-step-description'
          />
        </div>
      </div>
      <hr className='bg-dial-blue-chalk'/>
      <div className='flex flex-col gap-y-3'>
        <UseCaseStepDetailDatasets
          useCaseStep={useCaseStep}
          canEdit={canEdit}
          headerRef={datasetRef}
        />
      </div>
      <hr className='bg-dial-blue-chalk'/>
      <div className='flex flex-col gap-y-3'>
        <UseCaseStepDetailProducts
          useCaseStep={useCaseStep}
          canEdit={canEdit}
          headerRef={productRef}
        />
      </div>
      <hr className='bg-dial-blue-chalk mt-6'/>
      <div className='flex flex-col gap-y-3'>
        <UseCaseStepDetailWorkflows
          useCaseStep={useCaseStep}
          canEdit={canEdit}
          headerRef={workflowRef}
        />
      </div>
      <hr className='bg-dial-blue-chalk mt-6'/>
      <div className='flex flex-col gap-y-3'>
        <UseCaseStepDetailBuildingBlocks
          useCaseStep={useCaseStep}
          canEdit={canEdit}
          headerRef={buildingBlockRef}
        />
      </div>
    </div>
  )
})

UseCaseStepDetailRight.displayName = 'UseCaseStepDetailRight'

export default UseCaseStepDetailRight
