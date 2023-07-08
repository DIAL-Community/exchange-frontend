import { useIntl } from 'react-intl'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { REBRAND_BASE_PATH } from '../utils/constants'
import EditButton from '../shared/form/EditButton'
import { HtmlViewer } from '../shared/form/HtmlViewer'
import { useUser } from '../../../lib/hooks'
import DeleteBuildingBlock from './DeleteBuildingBlock'

const BuildingBlockDetailRight = forwardRef(({ buildingBlock }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser, isEditorUser } = useUser()
  const canEdit = (isAdminUser || isEditorUser) && !buildingBlock.markdownUrl

  const descRef = useRef()
  const stepRef = useRef()
  const workflowRef = useRef()
  const sdgTargetRef = useRef()
  const buildingBlockRef = useRef()
  const tagRef = useRef()

  useImperativeHandle(ref, () => ([
    { value: 'ui.common.detail.description', ref: descRef },
    { value: 'ui.buildingBlock.detail.steps', ref: stepRef },
    { value: 'ui.workflow.header', ref: workflowRef },
    { value: 'ui.sdgTarget.header', ref: sdgTargetRef },
    { value: 'ui.buildingBlock.header', ref: buildingBlockRef },
    { value: 'ui.tag.header', ref: tagRef }
  ]), [])

  return (
    <div className='flex flex-col gap-y-4 py-4'>
      <div className='flex flex-col gap-y-3'>
        <div className='flex gap-x-3 ml-auto'>
          {canEdit &&
            <EditButton
              type='link'
              href={`${REBRAND_BASE_PATH}/building-blocks/${buildingBlock.slug}/edit`}
            />
          }
          {isAdminUser && <DeleteBuildingBlock buildingBlock={buildingBlock} />}
        </div>
        <div className='text-xl font-semibold text-dial-ochre py-3' ref={descRef}>
          {format('ui.common.detail.description')}
        </div>
        <div className='block'>
          <HtmlViewer
            initialContent={buildingBlock?.buildingBlockDescription?.description}
            editorId='buildingBlock-description'
          />
        </div>
      </div>
    </div>
  )
})

BuildingBlockDetailRight.displayName = 'BuildingBlockDetailRight'

export default BuildingBlockDetailRight
