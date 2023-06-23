import { useIntl } from 'react-intl'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { HtmlViewer } from '../../shared/form/HtmlViewer'

const UseCaseStepDetailRight = forwardRef(({ useCaseStep }, ref) => {
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
        <div className='text-xl font-semibold text-dial-blueberry py-3' ref={datasetRef}>
          {format('ui.dataset.header')}
        </div>
      </div>
      <hr className='bg-dial-blue-chalk'/>
      <div className='flex flex-col gap-y-3'>
        <div className='text-xl font-semibold text-dial-blueberry py-3' ref={productRef}>
          {format('ui.product.header')}
        </div>
      </div>
      <hr className='bg-dial-blue-chalk mt-6'/>
      <div className='flex flex-col gap-y-3'>
        <div className='text-xl font-semibold text-dial-blueberry py-3' ref={workflowRef}>
          {format('ui.workflow.header')}
        </div>
      </div>
      <hr className='bg-dial-blue-chalk mt-6'/>
      <div className='flex flex-col gap-y-3'>
        <div className='text-xl font-semibold text-dial-blueberry py-3' ref={buildingBlockRef}>
          {format('ui.buildingBlock.header')}
        </div>
      </div>
    </div>
  )
})

UseCaseStepDetailRight.displayName = 'UseCaseStepDetailRight'

export default UseCaseStepDetailRight
