import { forwardRef, useImperativeHandle, useRef } from 'react'
import { HtmlViewer } from '../../../components/shared/HtmlViewer'

const UseCaseDetailRight = forwardRef(({ useCase }, ref) => {
  const descRef = useRef()
  const stepRef = useRef()
  const workflowRef = useRef()
  const sdgTargetRef = useRef()
  const buildingBlockRef = useRef()
  const tagRef = useRef()

  useImperativeHandle(ref, () => ({
    descRef,
    stepRef,
    workflowRef,
    sdgTargetRef,
    buildingBlockRef,
    tagRef
  }))

  return (
    <div className='flex flex-col gap-y-4'>
      <div className='flex flex-col gap-y-3'>
        <div className='text-lg font-semibold'>
          Description
        </div>
        <div className='block'>
          <HtmlViewer
            initialContent={useCase?.useCaseDescription?.description}
            editorId='use-case-detail'
          />
        </div>
      </div>
    </div>
  )
})

UseCaseDetailRight.displayName = 'UseCaseDetailRight'

export default UseCaseDetailRight
